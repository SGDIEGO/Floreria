package middlewares

import (
	"fmt"
	"net/http"

	"github.com/SGDIEGO/Floreria/util"
	"github.com/golang-jwt/jwt/v5"
)

func verifyToken(tokenString string) error {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Hubo un error")
		}
		return []byte("token_auth"), nil
	})

	if err != nil {
		return err
	}

	if !token.Valid {
		return fmt.Errorf("invalid token")
	}

	return nil
}

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Obtener token desde el header
		tokenString := r.Header.Get("Authorization")

		// Si token no existe
		if tokenString == "" {
			util.JsonResponse(w, http.StatusUnauthorized, util.Response{
				Data:  nil,
				Error: "token no existe",
			})
			return
		}

		// Extraer el valor del token
		tokenString = tokenString[len("Bearer "):]
		err := verifyToken(tokenString)
		if err != nil {
			util.JsonResponse(w, http.StatusUnauthorized, util.Response{
				Error: "token invalido",
			})
			return
		}

		next.ServeHTTP(w, r)
	})
}
