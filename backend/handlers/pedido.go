package handlers

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/SGDIEGO/Floreria/services"
	"github.com/SGDIEGO/Floreria/util"
)

type PedidoHandler struct {
	pedidoService *services.PedidoService
}

func NewPedidoHandler(db_ *sql.DB) *PedidoHandler {
	return &PedidoHandler{
		pedidoService: services.NewPedidoService(db_),
	}
}

func (h *PedidoHandler) GetPedido(w http.ResponseWriter, r *http.Request) {
	// Extraer id
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	// Extraer pedido de base de datos
	pedido, err := h.pedidoService.GetPedidoById(id)
	if err != nil {
		util.JsonResponse(w, http.StatusNoContent, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	// Pedido valido
	util.JsonResponse(w, http.StatusOK, util.Response{
		Data: pedido,
	})
}

func (h *PedidoHandler) GetElementos_Pedido(w http.ResponseWriter, r *http.Request) {
	// Extraer id
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	// Extraer elementos
	elementos, err := h.pedidoService.GetElementosbyPedido(id)
	if err != nil {
		util.JsonResponse(w, http.StatusInternalServerError, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	util.JsonResponse(w, http.StatusBadRequest, util.Response{
		Data:  elementos,
		Error: "",
	})
}

func (h *PedidoHandler) PutFloristaPedido(w http.ResponseWriter, r *http.Request) {
	// Extraer id
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	// Extraer id florista
	idflorista, err := strconv.Atoi(r.PathValue("idflorista"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	// Asignar florista
	err = h.pedidoService.AsignarFloristatoPedido(id, idflorista)
	if err != nil {
		util.JsonResponse(w, http.StatusInternalServerError, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	util.JsonResponse(w, http.StatusInternalServerError, util.Response{
		Error: "",
	})
}

func (h *PedidoHandler) PutFinalizar(w http.ResponseWriter, r *http.Request) {
	// Extraer id
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	err = h.pedidoService.FinalizarPedido(id)
	if err != nil {
		util.JsonResponse(w, http.StatusInternalServerError, util.Response{
			Error: err.Error(),
		})
		return
	}

	util.JsonResponse(w, http.StatusInternalServerError, util.Response{
		Error: "",
	})
}

func (h *PedidoHandler) PutAsignarDelivery(w http.ResponseWriter, r *http.Request) {
	// Extraer id
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	err = h.pedidoService.AsignarDelivery(id)
	if err != nil {
		util.JsonResponse(w, http.StatusInternalServerError, util.Response{
			Error: err.Error(),
		})
		return
	}

	util.JsonResponse(w, http.StatusInternalServerError, util.Response{
		Error: "",
	})
}
