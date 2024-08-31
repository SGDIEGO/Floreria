package dto

type ElementoDto struct {
	Id          int
	Nombre      string
	Descripcion string
	Stock       int
	Precio      float64
	Puntos      int
	Imagen      string
	Tipo        int
}

type ProductoDto struct {
	Id          int
	Nombre      string
	Descripcion string
	Stock       int
	Precio      float64
	Imagen      string
	Puntos      int
	Categoria   string
}

type BeneficioDto struct {
	Id          int
	Nombre      string
	Descripcion string
	Precio      float64
	Stock       int
	Min_Puntos  int
	Imagen      string
}

type ComprarElementoDto struct {
	Stock int
}

type ModificarElemento struct {
	Precio float32
	Puntos int
	Stock  int
}
