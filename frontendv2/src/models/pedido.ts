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
  Elementos: ElementoDetalle[];
}

interface IPedido {
  Id: number;
  Monto: number;
  Fecha_entrega: Date;
  Fecha_emision: Date;
  Id_cliente: number;
  Id_medio_pago: number;
  Id_florista: any;
  Id_delivery: number;
}

export type { PedidoDetalle, ElementoDetalle, IPedido };
