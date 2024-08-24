package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/SGDIEGO/Floreria/dto"
	"github.com/SGDIEGO/Floreria/services"
	"github.com/SGDIEGO/Floreria/util"
)

type ElementoHandlers struct {
	elementoService *services.ElementoService
}

func NewElementoHandlers(db_ *sql.DB) *ElementoHandlers {
	elementoService := services.NewElementoService(db_)
	return &ElementoHandlers{
		elementoService: elementoService,
	}
}

// GET: elemento por id
func (h *ElementoHandlers) GetElementoById(w http.ResponseWriter, r *http.Request) {
	// Extraer id
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	data := h.elementoService.GetElementoById(id)
	if data == nil {
		util.JsonResponse(w, http.StatusNotFound, util.Response{
			Data:  nil,
			Error: "No se encontro dato",
		})
		return
	}

	// Retornar productos
	util.JsonResponse(w, 200, util.Response{
		Data:  data,
		Error: "",
	})
}

// GET: todos los elementos
func (h *ElementoHandlers) GetProductos(w http.ResponseWriter, r *http.Request) {
	data := h.elementoService.GetProductos()
	if data == nil {
		util.JsonResponse(w, 200, util.Response{
			Data:  nil,
			Error: "Error de carga de elementos",
		})
		return
	}

	// Retornar productos
	util.JsonResponse(w, 200, util.Response{
		Data:  data,
		Error: "",
	})
}

// GET: producto por id
func (h *ElementoHandlers) GetProductoById(w http.ResponseWriter, r *http.Request) {
	// Extraer id
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	data := h.elementoService.GetProductoById(id)
	if data == nil {
		util.JsonResponse(w, 200, util.Response{
			Data:  nil,
			Error: "Error de carga de elementos",
		})
		return
	}

	// Retornar productos
	util.JsonResponse(w, 200, util.Response{
		Data:  data,
		Error: "",
	})
}

// GET: todos los beneficios
func (h *ElementoHandlers) GetBeneficios(w http.ResponseWriter, r *http.Request) {
	data := h.elementoService.GetBeneficios()
	if data == nil {
		util.JsonResponse(w, 200, util.Response{
			Data:  nil,
			Error: "Error de carga de elementos",
		})
		return
	}

	// Retornar productos
	util.JsonResponse(w, 200, util.Response{
		Data:  data,
		Error: "",
	})
}

// GET: beneficio por id
func (h *ElementoHandlers) GetBeneficioById(w http.ResponseWriter, r *http.Request) {
	// Extraer id
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	data := h.elementoService.GetBeneficioById(id)
	if data == nil {
		util.JsonResponse(w, 200, util.Response{
			Data:  nil,
			Error: "Error de carga de elementos",
		})
		return
	}

	// Retornar productos
	util.JsonResponse(w, 200, util.Response{
		Data:  data,
		Error: "",
	})
}

// POST: comprar un producto
func (h *ElementoHandlers) ComprarElemento(w http.ResponseWriter, r *http.Request) {
	// Valor de id
	id, err := strconv.Atoi(r.PathValue("id"))

	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
	}

	var body dto.ComprarElementoDto
	// Error
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
	}

	err = h.elementoService.ComprarElemento(id, body.Stock)
	if err != nil {
		// Actualizado
		util.JsonResponse(w, http.StatusOK, util.Response{
			Error: "",
		})
		return
	}

	// Actualizado
	util.JsonResponse(w, http.StatusOK, util.Response{
		Error: "",
	})
}
