// Datos de ejemplo
export enum ELEMENTO {
  PRODUCTO_TIPO,
  BENEFICIO_TIPO,
}

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
  Puntos: number;
}

interface BeneficioCarrito {
  Id: number;
  Cantidad: number;
  Precio: number;
  Min_puntos: number;
}

interface ComprarElementoDto {
  Stock: number;
}

interface CompraDto {
  Monto: number;
  Id_cliente: number;
  Id_medio_pago: number;
  Id_florista: number;
  Elementos: {
    Id: number;
    Cantidad: number;
  }[];
}

interface ElementoDto {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Stock: number;
  Precio: number;

  Puntos: number;
  Imagen: string;
  Tipo: number;
}

interface CrearProducto {
  Nombre: string;
  Descripcion: string;
  Stock: number;
  Precio: number;
  Puntos: number;
  Categoria: number;
  Imagen: string;
}

interface CrearBeneficio {
  Nombre: string;
  Descripcion: string;
  Stock: number;
  Precio: number;
  Puntos: number;
  Imagen: string;
}

export type {
  Producto,
  ProductoCarrito,
  ComprarElementoDto,
  CompraDto,
  BeneficioCarrito,
  ElementoDto,
  CrearProducto,
  CrearBeneficio
};
