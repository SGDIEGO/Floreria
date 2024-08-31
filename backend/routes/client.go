package routes

import (
	"database/sql"
	_ "log"
	"net/http"

	"github.com/SGDIEGO/Floreria/handlers"
	"github.com/SGDIEGO/Floreria/middlewares"
)

// Datos de ejemplo
const (
	NoLogin = iota
	NoRegistrar
	Cliente_tipo
	Florista_tipo
)

type PersonaRt struct {
	path     string
	handlers *handlers.PersonaHandler
}

// Router para cliente
func NewClientRt(path_ string, db_ *sql.DB) IRoute {
	handlers_ := handlers.NewPersonaHandler(db_)
	return &PersonaRt{
		path:     path_,
		handlers: handlers_,
	}
}

// Cargar server
func (c *PersonaRt) load(server *http.ServeMux) {
	server.HandleFunc("POST "+c.path+"/login", c.handlers.LoginPersona)
	server.HandleFunc("POST "+c.path+"/register", c.handlers.RegistrarPersona)
	server.HandleFunc("GET "+c.path+"/{id}/refresh", middlewares.AuthMiddleware(c.handlers.RefreshToken))

	server.HandleFunc("POST "+c.path+"/usuario/{id}/pago", middlewares.AuthMiddleware(c.handlers.ComprarElementos))
	server.HandleFunc("GET "+c.path+"/usuario/{id}/pedidos", middlewares.AuthMiddleware(c.handlers.GetPedidos))
	server.HandleFunc("GET "+c.path+"/usuario/{id}/pedidos/{idpedido}", middlewares.AuthMiddleware(c.handlers.GetPedidoById))
	server.HandleFunc("PUT "+c.path+"/usuario/{id}", middlewares.AuthMiddleware(c.handlers.PutDatos))

	server.HandleFunc("GET "+c.path+"/florista/pedidos", middlewares.AuthMiddleware(c.handlers.GetPedidosPendientes))
	server.HandleFunc("GET "+c.path+"/florista/pedidos/{id}", middlewares.AuthMiddleware(c.handlers.RegistrarPedido))
	server.HandleFunc("GET "+c.path+"/florista/{id}/pedidos/registrados", middlewares.AuthMiddleware(c.handlers.GetPedidosRegistrados))
}
