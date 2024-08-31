package routes

import (
	"database/sql"
	_ "log"
	"net/http"

	"github.com/SGDIEGO/Floreria/handlers"
	"github.com/SGDIEGO/Floreria/middlewares"
)

type ElementoRt struct {
	path     string
	handlers *handlers.ElementoHandlers
}

// Router para elementos
func NewElementoRt(path_ string, db_ *sql.DB) IRoute {

	return &ElementoRt{
		path:     path_,
		handlers: handlers.NewElementoHandlers(db_),
	}
}

// Cargar server
func (c *ElementoRt) load(server *http.ServeMux) {
	server.HandleFunc("GET "+c.path+"/producto", c.handlers.GetProductos)
	server.HandleFunc("GET "+c.path+"/producto/{id}", middlewares.AuthMiddleware(c.handlers.GetProductoById))

	server.HandleFunc("GET "+c.path+"/beneficio", c.handlers.GetBeneficios)
	server.HandleFunc("GET "+c.path+"/beneficio/{id}", middlewares.AuthMiddleware(c.handlers.GetBeneficioById))

	server.HandleFunc("GET "+c.path+"/{id}", middlewares.AuthMiddleware(c.handlers.GetElementoById))
	server.HandleFunc("PUT "+c.path+"/{id}", middlewares.AuthMiddleware(c.handlers.ComprarElemento))

	server.HandleFunc("PUT "+c.path+"/{id}/modificar", middlewares.AuthMiddleware(c.handlers.ModificarElemento))
	server.HandleFunc("POST "+c.path+"/producto", middlewares.AuthMiddleware(c.handlers.PostProducto))
	server.HandleFunc("POST "+c.path+"/beneficio", middlewares.AuthMiddleware(c.handlers.PostBeneficio))

	server.HandleFunc("GET "+c.path+"/categorias", c.handlers.GetCategorias)
}
