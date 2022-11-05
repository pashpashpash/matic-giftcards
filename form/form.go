package form

import "github.com/pashpashpash/matic-giftcards/errorlist"

type Form interface {
	Validate() errorlist.Errors
	String() string
}
