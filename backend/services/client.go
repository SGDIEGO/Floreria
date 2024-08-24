package services

import (
	"database/sql"
	"time"

	"github.com/SGDIEGO/Floreria/dto"
	"github.com/SGDIEGO/Floreria/models"
)

// Datos de ejemplo
const (
	NoLogin = iota
	NoRegistrar
	Cliente_tipo
	Florista_tipo
)

type ClientService struct {
	db *sql.DB
}

func NewClientService(db_ *sql.DB) *ClientService {
	return &ClientService{
		db: db_,
	}
}

func (s *ClientService) GetPersona(correo, contraseña string) *models.Persona {
	query := "SELECT * FROM floreria.persona WHERE correo=? AND contraseña=?;"
	// Ejecutar query
	row := s.db.QueryRow(query, correo, contraseña)
	if row.Err() != nil {
		return nil
	}

	// Extraer datos
	var persona models.Persona
	err := row.Scan(&persona.Id, &persona.Dni, &persona.Nombres, &persona.Apellidos, &persona.Correo, &persona.Direccion, &persona.Telefono, &persona.Contraseña)
	if err != nil {
		return nil
	}

	return &persona
}

func (s *ClientService) GetClienteByQuery(id int) *models.Client {
	query := "SELECT * FROM floreria.cliente WHERE id_persona=?;"
	// Ejecutar query
	row := s.db.QueryRow(query, id)
	if row.Err() != nil {
		return nil
	}

	// Extraer datos
	var persona models.Client
	err := row.Scan(&persona.Id_persona, &persona.Puntos)
	if err != nil {
		return nil
	}

	return &persona
}

func (s *ClientService) GetFloristaByQuery(id int) *models.Florista {
	query := "SELECT * FROM floreria.florista WHERE id_persona=?;"
	// Ejecutar query
	row := s.db.QueryRow(query, id)
	if row.Err() != nil {
		return nil
	}

	// Extraer datos
	var persona models.Florista
	err := row.Scan(&persona.Id_persona, &persona.Id_trabajador)
	if err != nil {
		return nil
	}

	return &persona
}

func (s *ClientService) RegistrarPersona(datos *dto.RegistrarPersona) error {
	// Query
	query := "INSERT INTO `floreria`.`persona` (`dni`, `nombres`, `apellidos`, `correo`, `direccion`, `telefono`, `contraseña`) VALUES (?, ?, ?, ?, ?, ?, ?);"

	// Ejecutar query
	res, err := s.db.Exec(query, datos.Dni, datos.Nombres, datos.Apellidos, datos.Correo, datos.Direccion, datos.Telefono, datos.Contraseña)
	if err != nil {
		return err
	}

	lastId, err := res.LastInsertId()
	if err != nil {
		return err
	}

	// Añadir a tabla florista o cliente
	switch datos.TipoPersona {
	case Cliente_tipo:
		query = "INSERT INTO `floreria`.`cliente` (`id_persona`, `puntos`) VALUES (?, ?);"
		_, err := s.db.Exec(query, lastId, 0)
		if err != nil {
			return err
		}

	case Florista_tipo:
		query = "INSERT INTO `floreria`.`florista` (`id_persona`, `id_trabajador`) VALUES (?, ?);"
		_, err := s.db.Exec(query, lastId, 1)
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *ClientService) RegistrarPedido(data *dto.CompraDto) error {
	query := "INSERT INTO `floreria`.`pedido` (`monto`, `fecha_entrega`, `id_cliente`, `id_medio_pago`) VALUES (?, ?, ?, ?);"

	res, err := s.db.Exec(query, data.Monto, time.Now().Add(time.Hour*72), data.Id_cliente, data.Id_medio_pago)
	if err != nil {
		return err
	}

	lastId, err := res.LastInsertId()
	if err != nil {
		return err
	}

	query = "INSERT INTO `floreria`.`elemento_pedido` (`id_pedido`, `id_elemento`, `cantidad`) VALUES (?, ?, ?);"
	for _, elemento := range data.Elementos {
		_, err := s.db.Exec(query, lastId, elemento.Id, elemento.Cantidad)
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *ClientService) GetPedidos(id int) (*[]models.Pedido, error) {
	query := "SELECT id, monto, fecha_emision, fecha_entrega, id_medio_pago FROM floreria.pedido WHERE id_cliente = ?;"
	rows, err := s.db.Query(query, id)
	if err != nil {
		return nil, err
	}

	var pedidos []models.Pedido
	var pedido models.Pedido
	for rows.Next() {
		var fecha_emision []uint8
		var fecha_entrega []uint8
		if err := rows.Scan(&pedido.Id, &pedido.Monto, &fecha_emision, &fecha_entrega, &pedido.Id_medio_pago); err != nil {
			return nil, err
		}

		fechaentregaString := string(fecha_entrega)
		fechaentregaParched, err := time.Parse("2006-01-02 15:04:05", fechaentregaString) // Formato estándar de MySQL DATETIME
		if err != nil {
			return nil, err
		}

		fechaemisionString := string(fecha_emision)
		fechaemisionParched, err := time.Parse("2006-01-02 15:04:05", fechaemisionString) // Formato estándar de MySQL DATETIME
		if err != nil {
			return nil, err
		}

		pedido.Fecha_entrega = fechaentregaParched
		pedido.Fecha_emision = fechaemisionParched

		pedidos = append(pedidos, pedido)
	}
	return &pedidos, nil
}

func (s *ClientService) GetPedidoById(idpedido int) (*models.PedidoDetalle, error) {
	var pedidoDetalle models.PedidoDetalle
	query := "SELECT id, monto, fecha_emision, fecha_entrega, id_medio_pago FROM floreria.pedido WHERE id = ?;"
	row := s.db.QueryRow(query, idpedido)
	if row.Err() != nil {
		return nil, row.Err()
	}

	var fecha_emision []uint8
	var fecha_entrega []uint8
	if err := row.Scan(&pedidoDetalle.Id, &pedidoDetalle.Monto, &fecha_emision, &fecha_entrega, &pedidoDetalle.Id_medio_pago); err != nil {
		return nil, err
	}

	fechaentregaString := string(fecha_entrega)
	fechaentregaParched, err := time.Parse("2006-01-02 15:04:05", fechaentregaString) // Formato estándar de MySQL DATETIME
	if err != nil {
		return nil, err
	}

	fechaemisionString := string(fecha_emision)
	fechaemisionParched, err := time.Parse("2006-01-02 15:04:05", fechaemisionString) // Formato estándar de MySQL DATETIME
	if err != nil {
		return nil, err
	}

	pedidoDetalle.Fecha_entrega = fechaentregaParched
	pedidoDetalle.Fecha_emision = fechaemisionParched

	query = "SELECT ep.id_elemento, e.nombre, e.descripcion FROM floreria.elemento_pedido ep JOIN floreria.elemento e ON e.id = ep.id_elemento WHERE ep.id_pedido = ?;"
	rows, err := s.db.Query(query, idpedido)
	if err != nil {
		return nil, err
	}

	var elementos []models.ElementoDetalle
	var elemento models.ElementoDetalle

	for rows.Next() {
		if err := rows.Scan(&elemento.Id_elemento, &elemento.Nombre, &elemento.Descripcion); err != nil {
			return nil, err
		}

		elementos = append(elementos, elemento)
	}

	pedidoDetalle.Elementos = elementos

	return &pedidoDetalle, nil

}

func (s *ClientService) GetPedidosPendientes() (*[]models.Pedido, error) {
	query := "SELECT id, monto, fecha_emision, fecha_entrega, id_cliente, id_medio_pago FROM floreria.pedido WHERE id_florista is null;"
	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}

	var pedidos []models.Pedido
	var pedido models.Pedido
	for rows.Next() {
		var fecha_emision []uint8
		var fecha_entrega []uint8
		if err := rows.Scan(&pedido.Id, &pedido.Monto, &fecha_emision, &fecha_entrega, &pedido.Id_cliente, &pedido.Id_medio_pago); err != nil {
			return nil, err
		}

		fechaentregaString := string(fecha_entrega)
		fechaentregaParched, err := time.Parse("2006-01-02 15:04:05", fechaentregaString) // Formato estándar de MySQL DATETIME
		if err != nil {
			return nil, err
		}

		fechaemisionString := string(fecha_emision)
		fechaemisionParched, err := time.Parse("2006-01-02 15:04:05", fechaemisionString) // Formato estándar de MySQL DATETIME
		if err != nil {
			return nil, err
		}

		pedido.Fecha_entrega = fechaentregaParched
		pedido.Fecha_emision = fechaemisionParched

		pedidos = append(pedidos, pedido)
	}
	return &pedidos, nil
}

func (s *ClientService) RegistrarPedidoFlorista(idpedido int, idflorista int) error {
	query := "UPDATE `floreria`.`pedido` SET `id_florista` = ? WHERE (`id` = ?);"

	s.db.Exec(query)

	return nil
}
