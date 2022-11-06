package form

import (
	"github.com/pashpashpash/matic-giftcards/errorlist"
	"github.com/pashpashpash/matic-giftcards/validator"
)

type RelayRedeemForm struct {
	DepositAccountAddress string `schema:"depositaccountaddress" json:"depositaccountaddress"`
	Signature             string `schema:"signature"  json:"signature"`
	FunctionSignature     string `schema:"functionsignature"  json:"functionsignature"`
	R                     string `schema:"r"  json:"r"`
	S                     string `schema:"s"  json:"s"`
	V                     string `schema:"v"  json:"v"`
	ClaimerAccount        string `schema:"claimeraccount"  json:"claimeraccount"`
}

func (me *RelayRedeemForm) Validate() errorlist.Errors {
	errs := errorlist.New()
	validator.CheckNotEmpty(me.DepositAccountAddress, "depositaccountaddress", errs)
	validator.CheckNotEmpty(me.Signature, "signature", errs)
	validator.CheckNotEmpty(me.FunctionSignature, "functionsignature", errs)
	validator.CheckNotEmpty(me.R, "r", errs)
	validator.CheckNotEmpty(me.S, "s", errs)
	validator.CheckNotEmpty(me.V, "v", errs)
	return errs
}

func (me *RelayRedeemForm) String() string {
	return "RELAY#" + me.DepositAccountAddress
}