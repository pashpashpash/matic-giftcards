package datastoreclient

import (
	"context"
	"log"
	"time"

	"github.com/pashpashpash/matic-giftcards/serverutil"

	"cloud.google.com/go/datastore"
	cache "github.com/patrickmn/go-cache"
	"google.golang.org/api/option"
)

var DatastoreClient *datastore.Client

var (
	NAMESPACE = ""
	C         *cache.Cache
	CONFIG    *serverutil.ConstantsConfig
)

const (
	TRANSACTION_RETRIES        = 10  // how many times we retry if a tx is locked
	TRANSACTION_RETRY_DELAY_MS = 200 // ms between transaction retries
)

// Initialize Google Cloud Datastore connection. If namespace is not an empty
// string, then it will be used for datastore keys and queries. Ex. use "stage"
// to use the staging namespace instead of the main one
func Start(namespace string) error {
	startTime := time.Now()
	NAMESPACE = namespace
	C = cache.New(5*time.Minute, 10*time.Minute)
	CONFIG = serverutil.GetConfig()

	var err error
	DatastoreClient, err = datastore.NewClient(context.Background(),
		"nugbase-main",
		option.WithCredentialsFile("./secret/datastore-admin-fbc8ee3ffcfe.json"))

	if err != nil {
		log.Println("Error Connecting Datastore!", err)
	}

	elapsed := time.Since(startTime)
	log.Printf("[Datastore] Connection Latency: %s\n", elapsed)

	return err
}

func Close() {
	if err := DatastoreClient.Close(); err != nil {
		log.Println("Wow, error closing datastore", err)
	}
}

func NameKey(kind, name string, parent *datastore.Key) *datastore.Key {
	key := datastore.NameKey(kind, name, parent)
	if NAMESPACE != "" {
		key.Namespace = NAMESPACE
	}
	return key
}

func NewQuery(kind string) *datastore.Query {
	query := datastore.NewQuery(kind)
	if NAMESPACE != "" {
		return query.Namespace(NAMESPACE)
	}
	return query
}
