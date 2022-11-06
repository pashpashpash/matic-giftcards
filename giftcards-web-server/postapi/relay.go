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