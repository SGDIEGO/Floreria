package util

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Standard string reponse for handlers
func StringResponse(w http.ResponseWriter, s int, r string) {
	w.WriteHeader(s)
	w.Header().Add("Content-Type", "application/json")
	fmt.Fprint(w, r)
}

// Standard json response for handlers
func JsonResponse(w http.ResponseWriter, s int, r any) {
	w.WriteHeader(s)
	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(r)
}
