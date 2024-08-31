package models

import "time"

type ElementoPedido struct {
	Id_elemento int
	Nombre      string
	Cantidad    int
}

type Pedido struct {
	Id            int
	Monto         float64
	Fecha_emision time.Time
	Fecha_entrega time.Time
	Id_cliente    int
	Correo        string
	Telefono      string
	Id_medio_pago int
	Id_florista   *int
	Id_delivery   *int
	Id_estado     int
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
	Id_florista   *int
	Id_delivery   *int
	Id_estado     int
	Elementos     []ElementoDetalle
}
