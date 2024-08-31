package services

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/SGDIEGO/Floreria/dto"
)

// Datos de ejemplo
const (
	PRODUCTO_TIPO = iota
	BENEFICIO_TIPO
)

type ElementoService struct {
	db *sql.DB
}

func NewElementoService(db_ *sql.DB) *ElementoService {
	return &ElementoService{
		db: db_,
	}
}

func (s *ElementoService) GetProductos() *[]dto.ProductoDto {
	// Query
	query := "SELECT e.id, e.nombre, e.stock, e.precio, e.imagen, e.descripcion,c.nombre AS categoria, p.puntos FROM elemento e INNER JOIN producto p ON e.id = p.id_elemento INNER JOIN categoria c ON p.id_categoria = c.id;"

	// Ejecutar query
	rows, err := s.db.Query(query)
	if err != nil {
		return nil
	}

	var elementos []dto.ProductoDto
	var elemento dto.ProductoDto

	for rows.Next() {
		if err := rows.Scan(&elemento.Id, &elemento.Nombre, &elemento.Stock, &elemento.Precio, &elemento.Imagen, &elemento.Descripcion, &elemento.Categoria, &elemento.Puntos); err != nil {
			return nil
		}

		elementos = append(elementos, elemento)
	}

	return &elementos
}

func (s *ElementoService) GetProductoById(id int) *dto.ProductoDto {
	// Query
	query := "SELECT e.id, e.nombre, e.stock, e.precio, e.imagen, e.descripcion,c.nombre AS categoria FROM elemento e INNER JOIN producto p ON e.id = p.id_elemento INNER JOIN categoria c ON p.id_categoria = c.id WHERE e.id=?;"

	// Ejecutar query
	row := s.db.QueryRow(query, id)
	if row.Err() != nil {
		return nil
	}

	var elemento dto.ProductoDto
	if err := row.Scan(&elemento.Id, &elemento.Nombre, &elemento.Stock, &elemento.Precio, &elemento.Imagen, &elemento.Descripcion, &elemento.Categoria); err != nil {
		return nil
	}

	return &elemento
}

func (s *ElementoService) GetBeneficios() *[]dto.BeneficioDto {
	// Query
	query := "SELECT e.id,e.nombre,e.stock,e.precio,e.imagen,e.descripcion,b.puntos FROM elemento e JOIN beneficio b ON e.id = b.id_elemento;"

	// Ejecutar query
	rows, err := s.db.Query(query)
	if err != nil {
		return nil
	}

	var elementos []dto.BeneficioDto
	var elemento dto.BeneficioDto

	for rows.Next() {
		if err := rows.Scan(&elemento.Id, &elemento.Nombre, &elemento.Stock, &elemento.Precio, &elemento.Imagen, &elemento.Descripcion, &elemento.Min_Puntos); err != nil {
			return nil
		}

		elementos = append(elementos, elemento)
	}

	return &elementos
}

func (s *ElementoService) GetBeneficioById(id int) *dto.BeneficioDto {
	// Query
	query := "SELECT e.id,e.nombre,e.stock,e.precio,e.imagen,e.descripcion,b.puntos FROM elemento e JOIN beneficio b ON e.id = b.id_elemento WHERE e.id=?;"

	// Ejecutar query
	row := s.db.QueryRow(query, id)
	if row.Err() != nil {
		return nil
	}

	var elemento dto.BeneficioDto
	if err := row.Scan(&elemento.Id, &elemento.Nombre, &elemento.Stock, &elemento.Precio, &elemento.Imagen, &elemento.Descripcion, &elemento.Min_Puntos); err != nil {
		return nil
	}

	return &elemento
}

func (s *ElementoService) ComprarElemento(id int, stock int) error {
	query := "SELECT stock FROM elemento WHERE id = ?;"
	row := s.db.QueryRow(query, id)
	if row.Err() != nil {
		return row.Err()
	}

	stockdisponible := 0
	if err := row.Scan(&stockdisponible); err != nil {
		return err
	}

	if stock > stockdisponible {
		return errors.New("stock no disponible")
	}

	return nil
}

func (s *ElementoService) GetElementoById(id int) *dto.ElementoDto {
	query := "SELECT * FROM elemento WHERE id=$1;"
	row := s.db.QueryRow(query, id)
	if row.Err() != nil {
		return nil
	}

	var elemento dto.ElementoDto
	if err := row.Scan(&elemento.Id, &elemento.Nombre, &elemento.Descripcion, &elemento.Stock, &elemento.Precio, &elemento.Imagen); err != nil {
		return nil
	}

	// Verificar el tipo y los puntos
	query = "SELECT puntos FROM producto WHERE id_elemento = $1 "
	err := s.db.QueryRow(query, id).Scan(&elemento.Puntos)

	// No hay errores, entonces es producto
	if err == nil {
		elemento.Tipo = PRODUCTO_TIPO
		return &elemento
	}

	query = "SELECT puntos FROM beneficio WHERE id_elemento = $1 "
	err = s.db.QueryRow(query, id).Scan(&elemento.Puntos)

	// No hay errores, entonces es producto
	if err == nil {
		elemento.Tipo = BENEFICIO_TIPO
		return &elemento
	}

	// No se encontro
	return nil
}

func (s *ElementoService) ModificarElemento(id int, data *dto.ModificarElemento) error {
	query := "UPDATE elemento SET stock = $1, precio = $2 WHERE id = $3"
	_, err := s.db.Exec(query, data.Stock, data.Precio, id)
	if err != nil {
		return err
	}

	// Beneficio
	query = "UPDATE beneficio SET puntos = $1 WHERE id_elemento = $2"
	res, _ := s.db.Exec(query, data.Puntos, id)
	i, _ := res.RowsAffected()
	if i == 1 {
		return nil
	}

	// Producto
	query = "UPDATE producto SET puntos = $1 WHERE id_elemento = $2"
	res, _ = s.db.Exec(query, data.Puntos, id)
	i, _ = res.RowsAffected()
	if i == 1 {
		return nil
	}

	return fmt.Errorf("elemento no existe")
}

func (s *ElementoService) CrearProducto(data *dto.CrearProducto) error {
	query := "INSERT INTO public.elemento (nombre, descripcion, stock, precio, imagen) VALUES ($1, $2, $3, $4, $5) RETURNING id;"
	id := 0
	fmt.Println("aaaa")
	err := s.db.QueryRow(query, data.Nombre, data.Descripcion, data.Stock, data.Precio, data.Imagen).Scan(&id)
	if err != nil {
		return err
	}

	query = "INSERT INTO producto (id_elemento, puntos, id_categoria) VALUES ($1, $2, $3)"
	fmt.Println("bbbb")
	_, err = s.db.Exec(query, id, data.Puntos, data.Categoria)
	if err != nil {
		return err
	}

	fmt.Println("cccc")
	return nil
}

func (s *ElementoService) CrearBeneficio(data *dto.CrearBeneficio) error {
	query := "INSERT INTO public.elemento (nombre, descripcion, stock, precio, imagen) VALUES ($1, $2, $3, $4, $5) RETURNING id;"
	id := 0
	err := s.db.QueryRow(query, data.Nombre, data.Descripcion, data.Stock, data.Precio, data.Imagen).Scan(&id)
	if err != nil {
		return err
	}

	query = "INSERT INTO beneficio (id_elemento, puntos) VALUES ($1, $2)"
	_, err = s.db.Exec(query, id, data.Puntos)
	if err != nil {
		return err
	}

	return nil
}

func (s *ElementoService) GetCategorias() (*[]dto.Categoria, error) {
	query := "SELECT * FROM categoria"
	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}

	var categorias []dto.Categoria
	var categoria dto.Categoria

	for rows.Next() {
		if err := rows.Scan(&categoria.Id, &categoria.Nombre); err != nil {
			return nil, err
		}

		categorias = append(categorias, categoria)
	}

	return &categorias, nil
}
