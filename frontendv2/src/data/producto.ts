interface Producto {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Stock: number;
  Precio: number;
  Imagen: string;
  Puntos: number;
  Categoria: string;
}

interface ProductoCarrito {
  Id: number;
  Cantidad: number;
  Precio: number;
}

interface ComprarElementoDto {
  Stock: number;
}

interface CompraDto {
  Monto: number;
  Fecha_entrega: Date;
  Fecha_emision: Date;
  Id_cliente: number;
  Id_medio_pago: number;
  Id_florista: number;
  Elementos: {
    Id: number;
    Cantidad: number;
  }[];
}

export type { Producto, ProductoCarrito, ComprarElementoDto, CompraDto };
