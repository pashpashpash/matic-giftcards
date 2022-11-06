package postapi

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
"os"
	"github.com/pashpashpash/matic-giftcards/errorlist"
	"github.com/pashpashpash/matic-giftcards/form"
	"github.com/pashpashpash/matic-giftcards/serverutil"

	"github.com/gorilla/schema"
	cache "github.com/patrickmn/go-cache"
)




type OpenZeppelinAutoTasksAPI struct {
	AutotaskRunID string                 `json:"autotaskRunId,omitempty"`
	AutotaskID    string                 `json:"autotaskId,omitempty"`
	Trigger       string                 `json:"trigger,omitempty"`
	Status        string                 `json:"status,omitempty"`
	CreatedAt     string                 `json:"createdAt,omitempty"`
	EncodedLogs   string                 `json:"encodedLogs,omitempty"`
	Result        map[string]interface{} `json:"result,omitempty"`
	RequestID     string                 `json:"requestId,omitempty"`
}


// RelayRedeemHandler Calls OpenZeppelin relay with provided metatx
func RelayRedeemHandler(w http.ResponseWriter, r *http.Request) {
	form := new(form.RelayRedeemForm)



	// Create Openzeppelin request
	openZeppelinRequestArguments, err := json.Marshal(form)
	if err != nil {
		log.Println("[RelayRedeem] Error marshalling OpenZeppelin request", err)
		http.Error(w, fmt.Sprintf("[RelayRedeem] Error marshalling OpenZeppelin request"), http.StatusNotFound)
		return
	}
	req, err := http.NewRequest(http.MethodPost, OPENZEPPELIN_WEBHOOK_URI, bytes.NewBuffer(openZeppelinRequestArguments))
	if err != nil {
		log.Println("[RelayRedeem] Error forming OpenZeppelin request", err)
		http.Error(w, fmt.Sprintf("[RelayRedeem] Error forming OpenZeppelin request"), http.StatusNotFound)
		return
	}
	req.Header.Add("X-Api-Key", OPENZEPPELIN_API_KEY)

	// Call Openzeppelin request
	HTTP_CLIENT = &http.Client{Timeout: 26 * time.Second}
	openZeppelinResponse, err := HTTP_CLIENT.Do(req)
	if err != nil {
		log.Println("[RelayRedeem] Error Fetching OpenZeppelin Data", err)
		http.Error(w, fmt.Sprintf("[RelayRedeem] Error Fetching OpenZeppelin Data"), http.StatusNotFound)
		return
	}
	openZeppelinDataBytes, err := ioutil.ReadAll(openZeppelinResponse.Body)
	if err != nil {
		log.Println("[RelayRedeem] Error Reading OpenZeppelin Data", err)
		http.Error(w, fmt.Sprintf("[RelayRedeem] Error Reading OpenZeppelin Data"), http.StatusNotFound)
		return
	}
	log.Println("[RelayRedeem] Fetched OpenZeppelin Response Bytes:", string(openZeppelinDataBytes))

	openZeppelinData := OpenZeppelinAutoTasksAPI{}
	json.Unmarshal(openZeppelinDataBytes, &openZeppelinData)
	log.Println("[RelayRedeem] Open Zepplin response ", openZeppelinData)
	if openZeppelinData.Status != "success" {
		log.Println("[RelayRedeem] Openzeppelin error", openZeppelinData.EncodedLogs, err)
		http.Error(w, fmt.Sprintf("[RelayRedeem] Relay Error. OpenZeppelin response status has error"), http.StatusNotFound)
		return
	}

	log.Println("[RelayRedeem] Completed")
}