package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/SGDIEGO/Floreria/dto"
	"github.com/SGDIEGO/Floreria/services"
	"github.com/SGDIEGO/Floreria/util"
	"github.com/golang-jwt/jwt/v5"
)

// Datos de ejemplo
const (
	NoLogin = iota
	NoRegistrar
	Cliente_tipo
	Florista_tipo
)

type PersonaHandler struct {
	clienteService *services.ClientService
}

func NewPersonaHandler(db_ *sql.DB) *PersonaHandler {
	return &PersonaHandler{
		clienteService: services.NewClientService(db_),
	}
}

// Logueo de persona
func (h *PersonaHandler) LoginPersona(w http.ResponseWriter, r *http.Request) {
	// Body
	var body dto.LoginPersona

	// Extraer datos del body
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	// Query
	persona, err := h.clienteService.GetPersona(body.Correo, body.Contraseña)
	if err != nil {
		util.JsonResponse(w, http.StatusNotFound, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	// Si no existe
	if persona == nil {
		util.JsonResponse(w, http.StatusNotFound, util.Response{
			Data:  nil,
			Error: "Usuario no existe en base de datos",
		})
		return
	}

	// Verificar si es cliente o florista
	cliente := h.clienteService.GetClienteByQuery(persona.Id)
	// Es cliente
	if cliente != nil {
		key := []byte("token_auth") /* Load key from somewhere, for example a file */
		t := jwt.NewWithClaims(jwt.SigningMethodHS256,
			jwt.MapClaims{
				"sub": dto.ClienteDto{
					Id:         persona.Id,
					Nombres:    persona.Nombres,
					Apellidos:  persona.Apellidos,
					Correo:     persona.Correo,
					Contraseña: persona.Contraseña,
					Puntos:     cliente.Puntos,
					Telefono:   persona.Telefono,
					Direccion:  persona.Direccion,
				},
				"aud": Cliente_tipo,
				"exp": time.Now().Add(time.Hour).Unix(),
				"iat": time.Now().Unix(),
			})

		s, err := t.SignedString(key)
		if err != nil {
			log.Println(err.Error())
			util.JsonResponse(w, http.StatusOK, util.Response{
				Error: "error creando token",
			})
			return
		}

		util.JsonResponse(w, http.StatusOK, util.Response{
			Data: s,
		})
		return
	}

	florista := h.clienteService.GetFloristaByQuery(persona.Id)

	// Existe
	if florista != nil {
		key := []byte("token_auth") /* Load key from somewhere, for example a file */
		t := jwt.NewWithClaims(jwt.SigningMethodHS256,
			jwt.MapClaims{
				"sub": dto.FloristaDto{
					Id:         persona.Id,
					Nombres:    persona.Nombres,
					Apellidos:  persona.Apellidos,
					Correo:     persona.Correo,
					Contraseña: persona.Contraseña,
					Telefono:   persona.Telefono,
					Direccion:  persona.Direccion,
				},
				"aud": Florista_tipo,
				"exp": time.Now().Add(time.Hour).Unix(),
				"iat": time.Now().Unix(),
			})

		s, err := t.SignedString(key)
		if err != nil {
			log.Println(err.Error())
			util.JsonResponse(w, http.StatusOK, util.Response{
				Error: "error creando token",
			})
			return
		}

		util.JsonResponse(w, http.StatusOK, util.Response{
			Data: s,
		})
		return
	}

	fmt.Println("z")
	util.JsonResponse(w, http.StatusInternalServerError, util.Response{
		Data:  nil,
		Error: "correo o contraseña no existen",
	})
}

// Registro de persona
func (h *PersonaHandler) RegistrarPersona(w http.ResponseWriter, r *http.Request) {
	var body dto.RegistrarPersona

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
	}

	// Añadir a base de datos
	err = h.clienteService.RegistrarPersona(&body)
	if err != nil {
		util.JsonResponse(w, http.StatusAccepted, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	util.JsonResponse(w, http.StatusAccepted, util.Response{
		Data:  nil,
		Error: "",
	})
}

func (h *PersonaHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	// Query
	persona, err := h.clienteService.GetPersonabyId(id)
	if err != nil {
		util.JsonResponse(w, http.StatusNotFound, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	// Si no existe
	if persona == nil {
		util.JsonResponse(w, http.StatusNotFound, util.Response{
			Data:  nil,
			Error: "Usuario no existe en base de datos",
		})
		return
	}

	// Verificar si es cliente o florista
	cliente := h.clienteService.GetClienteByQuery(persona.Id)
	// Es cliente
	if cliente != nil {
		key := []byte("token_auth") /* Load key from somewhere, for example a file */
		t := jwt.NewWithClaims(jwt.SigningMethodHS256,
			jwt.MapClaims{
				"sub": dto.ClienteDto{
					Id:         persona.Id,
					Nombres:    persona.Nombres,
					Apellidos:  persona.Apellidos,
					Correo:     persona.Correo,
					Contraseña: persona.Contraseña,
					Puntos:     cliente.Puntos,
					Telefono:   persona.Telefono,
					Direccion:  persona.Direccion,
				},
				"aud": Cliente_tipo,
				"exp": time.Now().Add(time.Hour).Unix(),
				"iat": time.Now().Unix(),
			})

		s, err := t.SignedString(key)
		if err != nil {
			log.Println(err.Error())
			util.JsonResponse(w, http.StatusOK, util.Response{
				Error: "error creando token",
			})
			return
		}

		util.JsonResponse(w, http.StatusOK, util.Response{
			Data: s,
		})
		return
	}

	florista := h.clienteService.GetFloristaByQuery(persona.Id)

	// Existe
	if florista != nil {
		key := []byte("token_auth") /* Load key from somewhere, for example a file */
		t := jwt.NewWithClaims(jwt.SigningMethodHS256,
			jwt.MapClaims{
				"sub": dto.FloristaDto{
					Id:         persona.Id,
					Nombres:    persona.Nombres,
					Apellidos:  persona.Apellidos,
					Correo:     persona.Correo,
					Contraseña: persona.Contraseña,
					Telefono:   persona.Telefono,
					Direccion:  persona.Direccion,
				},
				"aud": Florista_tipo,
				"exp": time.Now().Add(time.Hour).Unix(),
				"iat": time.Now().Unix(),
			})

		s, err := t.SignedString(key)
		if err != nil {
			log.Println(err.Error())
			util.JsonResponse(w, http.StatusOK, util.Response{
				Error: "error creando token",
			})
			return
		}

		util.JsonResponse(w, http.StatusOK, util.Response{
			Data: s,
		})
		return
	}

	util.JsonResponse(w, http.StatusInternalServerError, util.Response{
		Data:  nil,
		Error: "correo o contraseña no existen",
	})
}

func (h *PersonaHandler) ComprarElementos(w http.ResponseWriter, r *http.Request) {
	var body dto.CompraDto
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	err = h.clienteService.RegistrarPedido(&body)
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	util.JsonResponse(w, http.StatusOK, util.Response{
		Data:  nil,
		Error: "",
	})
}

func (h *PersonaHandler) GetPedidos(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	pedidos, err := h.clienteService.GetPedidos(id)
	if err != nil || pedidos == nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	util.JsonResponse(w, http.StatusOK, util.Response{
		Data:  pedidos,
		Error: "",
	})
}

func (h *PersonaHandler) GetPedidosPendientes(w http.ResponseWriter, r *http.Request) {

	pedidos, err := h.clienteService.GetPedidosPendientes()
	if err != nil || pedidos == nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	util.JsonResponse(w, http.StatusBadRequest, util.Response{
		Data:  pedidos,
		Error: "",
	})
}

func (h *PersonaHandler) GetPedidoById(w http.ResponseWriter, r *http.Request) {
	id_pedido, err := strconv.Atoi(r.PathValue("idpedido"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	pedidos, err := h.clienteService.GetPedidoById(id_pedido)
	if err != nil || pedidos == nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	util.JsonResponse(w, http.StatusBadRequest, util.Response{
		Data:  pedidos,
		Error: "",
	})
}

func (h *PersonaHandler) RegistrarPedido(w http.ResponseWriter, r *http.Request) {}

// Actualizar datos
func (h *PersonaHandler) PutDatos(w http.ResponseWriter, r *http.Request) {
	// Extraer id usuario
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Error: err.Error(),
		})
		return
	}

	// Extraer body
	var body dto.ActualizarPersona

	// Extraer datos del body
	err = json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	// Actualizar datos
	err = h.clienteService.ActualizarUsuarioById(id, &body)
	if err != nil {
		util.JsonResponse(w, http.StatusNotModified, util.Response{
			Error: err.Error(),
		})
		return
	}

	// Actualizado
	util.JsonResponse(w, http.StatusOK, util.Response{
		Error: "",
	})
}

func (h *PersonaHandler) GetPedidosRegistrados(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		util.JsonResponse(w, http.StatusBadRequest, util.Response{
			Data:  nil,
			Error: err.Error(),
		})
		return
	}

	pedidos, err := h.clienteService.GetPedidosRegistrados(id)
	if err != nil {
		util.JsonResponse(w, http.StatusInternalServerError, util.Response{
			Error: err.Error(),
		})
		return
	}

	util.JsonResponse(w, http.StatusInternalServerError, util.Response{
		Data: pedidos,
	})
}
