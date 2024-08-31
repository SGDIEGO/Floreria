package dto

type CrearProducto struct {
	Nombre      string
	Descripcion string
	Stock       int
	Precio      int
	Puntos      int
	Categoria   int
	Imagen      string
}

type CrearBeneficio struct {
	Nombre      string
	Descripcion string
	Stock       int
	Precio      int
	Puntos      int
	Imagen      string
}

type Categoria struct {
	Id     int
	Nombre string
}
