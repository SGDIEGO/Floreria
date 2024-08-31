package routes

import (
	"database/sql"
	"net/http"
)

// Interface de las rutas
type IRoute interface {
	load(server *http.ServeMux)
}

// Funcion para cargar rutas en el servidor
func InitRoutes(server *http.ServeMux, db *sql.DB) {
	personaRt := NewClientRt("/persona", db)
	elementoRt := NewElementoRt("/elemento", db)
	pedidoRt := NewPedidoRt("/pedido", db)

	personaRt.load(server)
	elementoRt.load(server)
	pedidoRt.load(server)
}
