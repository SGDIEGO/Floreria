interface ElementoDetalle {
  Id_elemento: number;
  Nombre: string;
  Descripcion: string;
}

interface PedidoDetalle {
  Id: number;
  Monto: number;
  Fecha_entrega: Date;
  Fecha_emision: Date;
  Id_cliente: number;
  Id_medio_pago: number;
  Id_florista: any;
  Id_delivery: number;
  Id_estado: number;
  Elementos: ElementoDetalle[];
}

interface ElementoPedido {
  Id_elemento: number;
  Nombre: string;
  Cantidad: number;
}

interface IPedido {
  Id: number;
  Monto: number;
  Fecha_emision: Date;
  Fecha_entrega: Date;
  Id_cliente: number;
  Correo: string;
  Telefono: string;
  Id_medio_pago: number;
  Id_florista: any;
  Id_delivery: number;
}

export type { PedidoDetalle, ElementoDetalle, IPedido, ElementoPedido };
