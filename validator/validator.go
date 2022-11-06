package validator

import (

	"github.com/pashpashpash/matic-giftcards/errorlist"
	"strings"

)

type Validator interface {
	Validate(map[string]error)
}


func CheckNotEmpty(input, name string, errs errorlist.Errors) {
	if len(strings.TrimSpace(input)) == 0 {
		errs[name] = errorlist.NewError("cannot be blank")
	}
}