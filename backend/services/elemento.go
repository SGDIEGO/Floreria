package services

import (
	"database/sql"
	"errors"

	"github.com/SGDIEGO/Floreria/dto"
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
	query := "SELECT e.id, e.nombre, e.stock, e.precio, e.imagen, e.descripcion,c.nombre AS categoria, p.puntos FROM floreria.elemento e INNER JOIN floreria.producto p ON e.id = p.id_elemento INNER JOIN floreria.categoria c ON p.id_categoria = c.id;"

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
	query := "SELECT e.id, e.nombre, e.stock, e.precio, e.imagen, e.descripcion,c.nombre AS categoria FROM floreria.elemento e INNER JOIN floreria.producto p ON e.id = p.id_elemento INNER JOIN floreria.categoria c ON p.id_categoria = c.id WHERE e.id=?;"

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
	query := "SELECT e.id,e.nombre,e.stock,e.precio,e.imagen,e.descripcion,b.puntos FROM floreria.elemento e JOIN floreria.beneficio b ON e.id = b.id_elemento;"

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
	query := "SELECT e.id,e.nombre,e.stock,e.precio,e.imagen,e.descripcion,b.puntos FROM floreria.elemento e JOIN floreria.beneficio b ON e.id = b.id_elemento WHERE e.id=?;"

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
	query := "SELECT stock FROM floreria.elemento WHERE id = ?;"
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
	query := "SELECT * FROM floreria.elemento WHERE id=?;"
	row := s.db.QueryRow(query, id)
	if row.Err() != nil {
		return nil
	}

	var elemento dto.ElementoDto
	if err := row.Scan(&elemento.Id, &elemento.Nombre, &elemento.Stock, &elemento.Precio, &elemento.Imagen, &elemento.Descripcion); err != nil {
		return nil
	}

	return &elemento
}
