package util

type M map[string]any

type Response struct {
	Data  any    `json:"Data"`
	Error string `json:"Error"`
}
