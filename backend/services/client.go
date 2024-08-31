package services

import (
	"database/sql"
	"fmt"
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
	Delivery_tipo
)

type ClientService struct {
	db *sql.DB
}

func NewClientService(db_ *sql.DB) *ClientService {
	return &ClientService{
		db: db_,
	}
}

func (s *ClientService) GetPersona(correo, contraseña string) (*models.Persona, error) {
	query := `SELECT id, nombres, apellidos, correo, contraseña, telefono, direccion FROM persona WHERE correo=$1 AND contraseña=$2;`
	// Ejecutar query
	row := s.db.QueryRow(query, correo, contraseña)
	if row.Err() != nil {
		return nil, row.Err()
	}

	// Extraer datos
	var persona models.Persona

	err := row.Scan(&persona.Id, &persona.Nombres, &persona.Apellidos, &persona.Correo, &persona.Contraseña, &persona.Telefono, &persona.Direccion)
	if err != nil {
		return nil, err
	}

	return &persona, nil
}

func (s *ClientService) GetPersonabyId(id int) (*models.Persona, error) {
	query := `SELECT id, nombres, apellidos, correo, contraseña, telefono, direccion FROM persona WHERE id=$1;`

	// Ejecutar query
	row := s.db.QueryRow(query, id)
	if row.Err() != nil {
		return nil, row.Err()
	}

	// Extraer datos
	var persona models.Persona

	err := row.Scan(&persona.Id, &persona.Nombres, &persona.Apellidos, &persona.Correo, &persona.Contraseña, &persona.Telefono, &persona.Direccion)
	if err != nil {
		return nil, err
	}

	return &persona, nil
}

func (s *ClientService) GetClienteByQuery(id int) *models.Client {
	query := `SELECT * FROM cliente WHERE id_persona=$1`
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
	query := "SELECT * FROM florista WHERE id_persona=$1;"
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
	// Verificar si existe usuario con correo
	c := 0
	query := `SELECT count(*) FROM persona WHERE correo = $1`
	err := s.db.QueryRow(query, datos.Correo).Scan(&c)
	if err != nil {
		return err
	}

	// Existe usuario con correo
	if c != 0 {
		return fmt.Errorf("correo registrado")
	}

	// Query
	query = `INSERT INTO persona (nombres, apellidos, correo, contraseña) VALUES ($1, $2, $3, $4) RETURNING id`

	// Ejecutar query
	id := 0
	err = s.db.QueryRow(query, datos.Nombres, datos.Apellidos, datos.Correo, datos.Contraseña).Scan(&id)
	if err != nil {
		return err
	}

	// Añadir a tabla florista o cliente
	fmt.Println(datos.TipoPersona)
	switch datos.TipoPersona {
	case Cliente_tipo:
		query = "INSERT INTO cliente (id_persona) VALUES ($1);"
		_, err := s.db.Exec(query, id)
		if err != nil {
			return err
		}

	case Florista_tipo:
		query = "INSERT INTO florista (id_persona, id_trabajador) VALUES ($1, $2);"
		_, err := s.db.Exec(query, id, 1)
		if err != nil {
			return err
		}

	case Delivery_tipo:
		query = "INSERT INTO delivery (id_persona, placa, disponible) VALUES ($1, $2, true);"
		_, err := s.db.Exec(query, id, datos.Placa)
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *ClientService) RegistrarPedido(data *dto.CompraDto) error {
	// Verificar que haya stock disponible
	query_stock := "SELECT stock FROM elemento WHERE id = $1"
	for _, elemento := range data.Elementos {
		disponible := 0
		err := s.db.QueryRow(query_stock, elemento.Id).Scan(&disponible)
		if err != nil {
			return err
		}

		// Verificar que stock este disponible
		if disponible < elemento.Cantidad {
			return fmt.Errorf("stock insuficiente para elemento con id: %d", elemento.Id)
		}
	}

	// Registrar compra
	lastId := 0
	query := "INSERT INTO pedido (monto, fecha_emision, fecha_entrega, id_cliente, id_medio_pago) VALUES ($1, $2, $3, $4, $5) RETURNING id;"
	err := s.db.QueryRow(query, data.Monto, time.Now(), time.Now().Add(time.Hour*72), data.Id_cliente, data.Id_medio_pago).Scan(&lastId)
	if err != nil {
		return err
	}

	// Actualizar el stock para los elementos e insertar cantidad de elementos comprados
	query_update := "UPDATE elemento SET stock = stock - $1 FROM producto WHERE elemento.id = $2 AND elemento.id = producto.id_elemento RETURNING producto.puntos"
	query_update_ben := "SELECT puntos FROM beneficio where id_elemento = $1"
	query_insert := "INSERT INTO elemento_pedido (id_pedido, id_elemento, cantidad) VALUES ($1, $2, $3);"
	puntos_total := 0

	for _, elemento := range data.Elementos {
		var puntos *int
		s.db.QueryRow(query_update, elemento.Cantidad, elemento.Id).Scan(&puntos)
		if puntos != nil {
			// Pertenece a tabla productos
			puntos_total += (*puntos * elemento.Cantidad)
		} else {
			// Pertenece a tabla beneficios
			s.db.QueryRow(query_update_ben, elemento.Id).Scan(&puntos)
			puntos_total -= (*puntos * elemento.Cantidad)
		}

		_, err = s.db.Exec(query_insert, lastId, elemento.Id, elemento.Cantidad)
		if err != nil {
			return err
		}
	}

	// Actualizar cantidad de puntos obtenidos
	query_update_puntos := "UPDATE cliente SET puntos = puntos + $1 WHERE id_persona = $2"
	_, err = s.db.Exec(query_update_puntos, puntos_total, data.Id_cliente)
	return err
}

func (s *ClientService) GetPedidos(id int) (*[]models.Pedido, error) {
	query := "SELECT id, monto, fecha_emision, fecha_entrega, id_medio_pago FROM pedido WHERE id_cliente = $1;"
	rows, err := s.db.Query(query, id)
	if err != nil {
		return nil, err
	}

	var pedidos []models.Pedido
	var pedido models.Pedido
	for rows.Next() {
		if err := rows.Scan(&pedido.Id, &pedido.Monto, &pedido.Fecha_emision, &pedido.Fecha_entrega, &pedido.Id_medio_pago); err != nil {
			return nil, err
		}

		pedidos = append(pedidos, pedido)
	}
	return &pedidos, nil
}

func (s *ClientService) GetPedidoById(idpedido int) (*models.PedidoDetalle, error) {
	var pedidoDetalle models.PedidoDetalle
	query := "SELECT * FROM pedido WHERE id = $1;"
	row := s.db.QueryRow(query, idpedido)
	if row.Err() != nil {
		return nil, row.Err()
	}

	if err := row.Scan(&pedidoDetalle.Id, &pedidoDetalle.Monto, &pedidoDetalle.Fecha_emision, &pedidoDetalle.Fecha_entrega, &pedidoDetalle.Id_cliente, &pedidoDetalle.Id_medio_pago, &pedidoDetalle.Id_florista, &pedidoDetalle.Id_delivery, &pedidoDetalle.Id_estado); err != nil {
		return nil, err
	}

	query = "SELECT ep.id_elemento, e.nombre, e.descripcion FROM elemento_pedido ep JOIN elemento e ON e.id = ep.id_elemento WHERE ep.id_pedido = $1;"
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
	query := "SELECT id, monto, fecha_emision, fecha_entrega, id_cliente, id_medio_pago FROM pedido WHERE id_florista is null;"
	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}

	var pedidos []models.Pedido
	var pedido models.Pedido
	for rows.Next() {
		if err := rows.Scan(&pedido.Id, &pedido.Monto, &pedido.Fecha_emision, &pedido.Fecha_entrega, &pedido.Id_cliente, &pedido.Id_medio_pago); err != nil {
			return nil, err
		}

		pedidos = append(pedidos, pedido)
	}
	return &pedidos, nil
}

func (s *ClientService) RegistrarPedidoFlorista(idpedido int, idflorista int) error {
	query := "UPDATE pedido SET id_florista = ? WHERE (id = ?);"

	s.db.Exec(query)

	return nil
}

func (s *ClientService) ActualizarUsuarioById(id int, data *dto.ActualizarPersona) error {
	// Query
	query := `UPDATE persona SET nombres = $1, apellidos = $2, correo = $3, direccion = $4, telefono = $5 WHERE id = $6`

	// Ejecutar query
	_, err := s.db.Exec(query, data.Nombres, data.Apellidos, data.Correo, data.Direccion, data.Telefono, id)
	if err != nil {
		return err
	}

	// Usuario actualizado
	return nil
}

func (s *ClientService) GetPedidosRegistrados(idflorista int) (*[]models.Pedido, error) {
	// Query
	query := "SELECT * FROM pedido WHERE id_florista=$1"
	rows, err := s.db.Query(query, idflorista)
	if err != nil {
		return nil, err
	}

	var pedidos []models.Pedido
	var pedido models.Pedido
	for rows.Next() {
		err := rows.Scan(&pedido.Id, &pedido.Monto, &pedido.Fecha_emision, &pedido.Fecha_entrega, &pedido.Id_cliente, &pedido.Id_medio_pago, &pedido.Id_florista, &pedido.Id_delivery, &pedido.Id_estado)
		if err != nil {
			return nil, err
		}

		pedidos = append(pedidos, pedido)
	}

	return &pedidos, nil
}
