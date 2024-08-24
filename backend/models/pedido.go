package models

import "time"

type Pedido struct {
	Id            int
	Monto         float64
	Fecha_entrega time.Time
	Fecha_emision time.Time
	Id_cliente    int
	Id_medio_pago int
	Id_florista   any
	Id_delivery   int
}

type ElementoDetalle struct {
	Id_elemento int
	Nombre      string
	Descripcion string
}

type PedidoDetalle struct {
	Id            int
	Monto         float64
	Fecha_entrega time.Time
	Fecha_emision time.Time
	Id_cliente    int
	Id_medio_pago int
	Id_florista   any
	Id_delivery   int
	Elementos     []ElementoDetalle
}
