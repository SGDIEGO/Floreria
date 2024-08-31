package routes

import (
	"database/sql"
	_ "log"
	"net/http"

	"github.com/SGDIEGO/Floreria/handlers"
	"github.com/SGDIEGO/Floreria/middlewares"
)

type PedidoRt struct {
	path     string
	handlers *handlers.PedidoHandler
}

// Router para cliente
func NewPedidoRt(path_ string, db_ *sql.DB) IRoute {
	handlers_ := handlers.NewPedidoHandler(db_)
	return &PedidoRt{
		path:     path_,
		handlers: handlers_,
	}
}

// Cargar server
func (c *PedidoRt) load(server *http.ServeMux) {
	server.HandleFunc("GET "+c.path+"/{id}", middlewares.AuthMiddleware(c.handlers.GetPedido))
	server.HandleFunc("PUT "+c.path+"/{id}/florista/{idflorista}", middlewares.AuthMiddleware(c.handlers.PutFloristaPedido))
	server.HandleFunc("GET "+c.path+"/{id}/elementos", middlewares.AuthMiddleware(c.handlers.GetElementos_Pedido))

	server.HandleFunc("PUT "+c.path+"/{id}/delivery", middlewares.AuthMiddleware(c.handlers.PutAsignarDelivery))
	server.HandleFunc("PUT "+c.path+"/{id}", middlewares.AuthMiddleware(c.handlers.PutFinalizar))
}
