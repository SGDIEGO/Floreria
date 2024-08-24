import { Producto, ProductoCarrito } from "../data/producto";

import Cookies from "js-cookie";
import { CARRITO_COOKIE, COOKIE_TOKEN } from "../data/token";
import { SetStateAction, useState } from "react";
import Notificacion from "./notificacion";
import { NotificacionTipo } from "../data/notificacion";
import { jwtDecode } from "jwt-decode";
import { Token } from "../interfaces/token";
import { Persona } from "../data/persona";

export default function ProductoComponente(producto: Producto) {
  // Usestate para notificacion
  const [tipoNotificacion, actualizar_tipoNotificacion] = useState(-1);
  const [mensajeNotificacion, actualizar_mensajeNotificacion] = useState("");
  const tipo = jwtDecode(Cookies.get(COOKIE_TOKEN)!) as Token;

  // Funcion para agregar producto a carrito
  function AgregarCarrito(id: number) {
    // Agregar id a carrito
    let carritoInfo = JSON.parse(
      Cookies.get(CARRITO_COOKIE)!
    ) as ProductoCarrito[];

    // Buscar si el producto ya ha sido añadido
    if (!carritoInfo.find((c) => c.Id == id)) {
      carritoInfo.push({
        Id: id,
        Cantidad: 0,
        Precio: producto.Precio,
      });

      Cookies.set(CARRITO_COOKIE, JSON.stringify(carritoInfo));

      // Notificacion de añadido satisfactoriamente
      actualizar_tipoNotificacion(NotificacionTipo.Sucessfull);
      actualizar_mensajeNotificacion("Producto añadido al carrito");
    } else {
      // Notificacion de añadido satisfactoriamente
      actualizar_tipoNotificacion(NotificacionTipo.Warning);
      actualizar_mensajeNotificacion("Producto ya ha sido añadido al carrito");
    }
  }

  // Funcion para modificar producto
  function ModificarProducto(id: number) {}

  return (
    <>
      <div key={producto.Id} className="card" style={{ width: "18rem" }}>
        <img
          src={producto.Imagen}
          className="card-img-top"
          alt="Chicago Skyscrapers"
          itemType="image/jpge"
        />
        <div className="card-body">
          <h5 className="card-title">{producto.Nombre}</h5>
          <p className="card-text">{producto.Descripcion}</p>
        </div>
        <ul className="list-group list-group-light list-group-small">
          <li className="list-group-item px-4">Precio: {producto.Precio}</li>
          <li className="list-group-item px-4">Puntos: {producto.Puntos}</li>
          <li className="list-group-item px-4">Stock: {producto.Stock}</li>
        </ul>
        <div className="card-body">
          {tipo.aud == Persona.Cliente_tipo && producto.Stock > 0 ? (
            <button
              className="card-link btn btn-primary"
              onClick={() => AgregarCarrito(producto.Id)}
            >
              Agregar a carrito
            </button>
          ) : null}

          {tipo.aud == Persona.Florista_tipo ? (
            <>
              <button
                className="card-link btn btn-primary"
                onClick={() => ModificarProducto(producto.Id)}
              >
                Modificar
              </button>
            </>
          ) : null}
        </div>
      </div>

      {tipoNotificacion != -1 ? (
        <Notificacion
          tipo={tipoNotificacion}
          mensaje={mensajeNotificacion}
          actualizar_tipoNotificacion={actualizar_tipoNotificacion}
          actualizar_responseNotificacion={null}
        />
      ) : null}
    </>
  );
}
