package services

import (
	"database/sql"

	"github.com/SGDIEGO/Floreria/models"
)

type PedidoService struct {
	db *sql.DB
}

func NewPedidoService(db_ *sql.DB) *PedidoService {
	return &PedidoService{
		db: db_,
	}
}

func (s *PedidoService) GetPedidoById(id int) (*models.Pedido, error) {
	// Query
	query := "SELECT pedido.id, monto, fecha_emision, fecha_entrega, id_cliente, p.correo, p.telefono, id_medio_pago, id_florista, id_delivery FROM public.pedido INNER JOIN persona as p ON pedido.id_cliente = p.id WHERE pedido.id = $1"

	// Ejecutar query
	row := s.db.QueryRow(query, id)
	if row.Err() != nil {
		return nil, row.Err()
	}

	var pedido models.Pedido
	// Extraer datos
	err := row.Scan(&pedido.Id, &pedido.Monto, &pedido.Fecha_emision, &pedido.Fecha_entrega, &pedido.Id_cliente, &pedido.Correo, &pedido.Telefono, &pedido.Id_medio_pago, &pedido.Id_florista, &pedido.Id_delivery)
	if err != nil {
		return nil, err
	}

	return &pedido, nil
}

func (s *PedidoService) GetElementosbyPedido(id int) (*[]models.ElementoPedido, error) {
	// Query
	query := "SELECT e.id, e.nombre, ep.cantidad FROM public.elemento_pedido as ep INNER JOIN elemento as e ON e.id = ep.id_elemento WHERE  id_pedido = $1"

	// Ejecutar query
	rows, err := s.db.Query(query, id)
	if err != nil {
		return nil, err
	}

	var pedidos []models.ElementoPedido
	var pedido models.ElementoPedido
	// Extraer datos
	for rows.Next() {
		err := rows.Scan(&pedido.Id_elemento, &pedido.Nombre, &pedido.Cantidad)
		if err != nil {
			return nil, err
		}

		pedidos = append(pedidos, pedido)
	}

	return &pedidos, nil
}

func (s *PedidoService) AsignarFloristatoPedido(idpedido, idflorista int) error {
	// Query
	query := "UPDATE pedido SET id_florista=$1, id_estado=2 WHERE id = $2"
	_, err := s.db.Exec(query, idflorista, idpedido)
	if err != nil {
		return err
	}

	return err
}

func (s *PedidoService) AsignarDelivery(idpedido int) error {
	query := "UPDATE delivery SET disponible=FALSE WHERE disponible = TRUE RETURNING id_persona"
	var iddelivery *int
	err := s.db.QueryRow(query).Scan(&iddelivery)
	if err != nil {
		return err
	}

	// UPDATE pedido SET id_estado = 3 WHERE id=2 RETURNING id_delivery
	query = "UPDATE pedido SET id_delivery = $1, id_estado = 3 WHERE id=$2"
	_, err = s.db.Exec(query, iddelivery, idpedido)
	if err != nil {
		return err
	}

	return nil
}

func (s *PedidoService) FinalizarPedido(idpedido int) error {
	// Finalizar estado de pedido
	query := "UPDATE pedido SET id_estado = $1 WHERE id=$2 RETURNING id_delivery"
	iddelivery := 0
	err := s.db.QueryRow(query, 4, idpedido).Scan(&iddelivery)
	if err != nil {
		return err
	}

	// Delivery disponible
	query = "UPDATE delivery SET disponible=TRUE WHERE id_persona=$1"
	_, err = s.db.Exec(query, iddelivery)

	return err
}
