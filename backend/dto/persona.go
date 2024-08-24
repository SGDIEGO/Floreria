package dto

import "time"

// Interface para el login
type LoginPersona struct {
	Correo     string
	Contraseña string
}

type RegistrarPersona struct {
	Dni         string `json:"Dni"`
	Direccion   string `json:"Direccion"`
	Nombres     string `json:"Nombres"`
	Apellidos   string `json:"Apellidos"`
	Telefono    string `json:"Telefono"`
	Correo      string `json:"Correo"`
	Contraseña  string `json:"Contraseña"`
	TipoPersona int
}

// Interface para retorno de login
type ClienteDto struct {
	Id         int    `json:"Id"`
	Dni        int    `json:"Dni"`
	Nombres    string `json:"Nombres"`
	Apellidos  string `json:"Apellidos"`
	Correo     string `json:"Correo"`
	Contraseña string `json:"Contraseña"`
	Direccion  string `json:"Direccion"`
	Telefono   string `json:"Telefono"`
	Puntos     int    `json:"Puntos"`
}

type FloristaDto struct {
	Id         int     `json:"Id"`
	Dni        int     `json:"Dni"`
	Nombres    string  `json:"Nombres"`
	Apellidos  string  `json:"Apellidos"`
	Correo     string  `json:"Correo"`
	Contraseña string  `json:"Contraseña"`
	Direccion  string  `json:"Direccion"`
	Telefono   string  `json:"Telefono"`
	Sueldo     float32 `json:"Sueldo"`
}

type LoginResponseDto struct {
	Tipo int
	Data any
}

type CompraElementoDto struct {
	Id       int
	Cantidad int
}

type CompraDto struct {
	Id            int
	Monto         float32
	Fecha_entrega time.Time
	Fecha_emision time.Time
	Id_cliente    int
	Id_medio_pago int
	Id_florista   int
	Elementos     []CompraElementoDto
}
