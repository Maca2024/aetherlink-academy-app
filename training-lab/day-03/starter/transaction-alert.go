package main

type Transaction struct { ID string; AmountEUR int; Region string }
type Alert struct { Alert bool; Reason string; Severity string }

func alertForTransaction(transaction Transaction) Alert {
	if transaction.AmountEUR >= 9000 { return Alert{true, "amount exceeds the fictional review threshold", "high"} }
	return Alert{false, "within the fictional review threshold", "low"}
}
