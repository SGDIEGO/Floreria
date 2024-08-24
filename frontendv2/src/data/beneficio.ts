import { Producto } from "./producto";

interface Beneficio {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Precio: number;
  Stock: number;
  Min_Puntos: number;
  Productos: Producto[];
}

export type { Beneficio };
