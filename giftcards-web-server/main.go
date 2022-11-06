package main

import (
	"flag"
	"html/template"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"
	"time"

	"compress/gzip"
	"io"

	"github.com/pashpashpash/matic-giftcards/serverutil"

	"github.com/pashpashpash/matic-giftcards/giftcards-web-server/postapi"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
)

const (
	NegroniLogFmt = `{{.StartTime}} | {{.Status}} | {{.Duration}}
          {{.Method}} {{.Path}}`
	NegroniDateFmt = time.Stamp
)

var (
	debugSite = flag.Bool(
		"debug", false, "debug site")
	port = flag.String(
		"port", "8100", "server port")

	siteConfig = map[string]string{
		"DEBUG_SITE": "false",
	}
)

func main() {
	// Parse command line flags + override defaults
	flag.Parse()
	siteConfig["DEBUG_SITE"] = strconv.FormatBool(*debugSite)
	rand.Seed(time.Now().UnixNano())

	// Initialize modules
	postapi.Run()

	// Configure main web server
	server := negroni.New()
	server.Use(negroni.NewRecovery())
	l := negroni.NewLogger()
	l.SetFormat(NegroniLogFmt)
	l.SetDateFormat(NegroniDateFmt)
	server.Use(l)
	mx := mux.NewRouter()

	// OpenZeppelin Relay
	mx.HandleFunc("/relay/redeem", postapi.RelayRedeemHandler).Methods("POST")

	// Path Routing Rules: Static Handlers
	mx.HandleFunc("/github", StaticRedirectHandler("https://github.com/pashpashpash/matic-giftcards"))
	mx.PathPrefix("/").Handler(ReactFileServer(http.Dir(serverutil.WebAbs(""))))

	// Start up web server
	server.UseHandler(mx)
	server.Run(":" + *port)
}

/// Takes a response writer Meta config and URL and servers the react app with the correct metadata
func ServeIndex(w http.ResponseWriter, r *http.Request, meta serverutil.SiteConfig) {
	//Here we handle the possible dev environments or pass the basic Hostpath with "/" at the end for the / metadata for each site
	var currentHost string
	var currentSite string

	// create local version of the Global SiteConfig variable to prevent editing concurrent variables.
	var localSiteConfig = map[string]string{}
	for key, element := range siteConfig {
		localSiteConfig[key] = element
	}

	//set the host Manually when on local host
	if r.Host == "localhost:8100" {
		currentHost = "matic-giftcards.app"
		currentSite = "matic-giftcards"

	} else {
		currentHost = r.Host
		currentSite = "matic-giftcards"

	}
	currentpath := currentHost + r.URL.Path
	//check if the currentpath has Metadata associated with it
	//if no metadata is founnd use the default / route
	ctx := r.Context()
	defer ctx.Done()

	// TODO fix metadata api
	currentMetaData := meta.SitePath[currentpath]

	localSiteConfig["PageTitle"] = currentMetaData.PageTitle
	localSiteConfig["PageIcon"] = currentMetaData.PageIcon
	localSiteConfig["MetaType"] = currentMetaData.MetaType
	localSiteConfig["MetaTitle"] = currentMetaData.MetaTitle
	localSiteConfig["MetaDescription"] = currentMetaData.MetaDescription
	localSiteConfig["MetaUrl"] = "https://" + currentHost + r.URL.String()
	localSiteConfig["MetaKeywords"] = currentMetaData.MetaKeywords
	localSiteConfig["Site"] = currentSite
	localSiteConfig["TwitterUsername"] = currentMetaData.TwitterUsername
	/// Here we need to check the type and either add an Image meta tag or a video metatag depending on the result
	if currentMetaData.MetaImage != "!" {
		localSiteConfig["contentType"] = "og:image"
		localSiteConfig["content"] = currentMetaData.MetaImage
	} else {
		localSiteConfig["contentType"] = "og:video"
		if currentMetaData.MetaVideo != "!" {
			localSiteConfig["content"] = currentMetaData.MetaVideo

		} else { //
			localSiteConfig["content"] = ""
			log.Fatalln("Image and video tag missing from JSON template")
		}
	}

	replaceEmpty := func(i string, r string) string {
		if i == "" {
			return r
		}
		return i
	}

	localSiteConfig["MetaTitle"] = replaceEmpty(localSiteConfig["MetaTitle"], "GiftCards")
	localSiteConfig["MetaType"] = replaceEmpty(localSiteConfig["MetaType"], "website")
	localSiteConfig["MetaDescription"] = replaceEmpty(localSiteConfig["MetaDescription"],
		"Pick any NFT from your wallet & transform it into a scannable URL reward!")
	localSiteConfig["TwitterUsername"] = replaceEmpty(localSiteConfig["TwitterUsername"], "@redeemableNFT")
	localSiteConfig["MetaKeywords"] = replaceEmpty(localSiteConfig["MetaKeywords"], "Giftcards, MATIC, Reward")
	localSiteConfig["PageTitle"] = replaceEmpty(localSiteConfig["PageTitle"], "Giftcards")
	localSiteConfig["PageIcon"] = replaceEmpty(localSiteConfig["Icon"], "/img/logos/redeemable-favicon-32.png")
	localSiteConfig["content"] = replaceEmpty(localSiteConfig["content"], "/img/common/meta-image.png")
	localSiteConfig["contentType"] = replaceEmpty(localSiteConfig["contentType"], "og:image")
	localSiteConfig["ImageHeight"] = replaceEmpty(localSiteConfig["ImageHeight"], "200")
	localSiteConfig["ImageWidth"] = replaceEmpty(localSiteConfig["ImageWidth"], "300")

	t, err := template.ParseFiles(serverutil.WebAbs("index.html"))
	config := struct {
		Config map[string]string
	}{
		localSiteConfig,
	}
	if err != nil {
		log.Fatalln("Critical error parsing index template!", err)
	}

	if err2 := t.Execute(w, config); err2 != nil {
		log.Fatalln("Template execute error!", err)
	}
}

type gzipResponseWriter struct {
	io.Writer
	http.ResponseWriter
}

func (w gzipResponseWriter) Write(b []byte) (int, error) {
	return w.Writer.Write(b)
}

// Forwards all traffic to React, except basic file serving
func ReactFileServer(fs http.FileSystem) http.Handler {
	fsh := http.FileServer(fs)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//get the Metadata Config
		jsonConfig := serverutil.GetConfig()

		if path.Clean(r.URL.Path) == "/" || path.Clean(r.URL.Path) == "/index.html" {
			ServeIndex(w, r, jsonConfig.SiteMetaData)
			return
		}

		if _, err := os.Stat(serverutil.WebAbs(r.URL.Path)); os.IsNotExist(err) {
			ServeIndex(w, r, jsonConfig.SiteMetaData)
			return
		}

		// if gzip not possible serve as is
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			fsh.ServeHTTP(w, r)
			return
		}

		w.Header().Set("Content-Encoding", "gzip")
		gz := gzip.NewWriter(w)
		defer gz.Close()
		fsh.ServeHTTP(gzipResponseWriter{Writer: gz, ResponseWriter: w}, r)
	})
}

func StaticRedirectHandler(to string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, to, http.StatusPermanentRedirect)
	}
}
