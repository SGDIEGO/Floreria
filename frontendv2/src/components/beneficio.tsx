import { BeneficioCarrito, ProductoCarrito } from "../data/producto";

import Cookies from "js-cookie";
import { CARRITO_COOKIE, COOKIE_TOKEN } from "../data/token";
import { Beneficio } from "../data/beneficio";
import { NotificacionTipo } from "../data/notificacion";
import { useState } from "react";
import Notificacion from "./notificacion";
import { Persona } from "../data/persona";
import { jwtDecode } from "jwt-decode";
import { Token } from "../interfaces/token";
import { HOST } from "../data/http";
import { IResponse } from "../interfaces/http";

export default function BeneficioComponente(beneficio: Beneficio) {
  // Usestate para notificacion
  const [tipoNotificacion, actualizar_tipoNotificacion] = useState(-1);
  const [mensajeNotificacion, actualizar_mensajeNotificacion] = useState("");
  const [data, actualizar_data] = useState(beneficio);
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
        Precio: beneficio.Precio,
        Puntos: beneficio.Min_Puntos,
      });

      Cookies.set(CARRITO_COOKIE, JSON.stringify(carritoInfo)); // Notificacion de añadido satisfactoriamente
      actualizar_tipoNotificacion(NotificacionTipo.Sucessfull);
      actualizar_mensajeNotificacion("Producto añadido al carrito");
    } else {
      // Notificacion de añadido satisfactoriamente
      actualizar_tipoNotificacion(NotificacionTipo.Warning);
      actualizar_mensajeNotificacion("Producto ya ha sido añadido al carrito");
    }
  }

  // Funcion para modificar producto
  function ModificarBeneficio(id: number) {
    (async () => {
      try {
        const res = await fetch(HOST + "/elemento/" + id + "/modificar", {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
          },
          body: JSON.stringify({
            Precio: Number(data.Precio),
            Puntos: Number(data.Min_Puntos),
            Stock: Number(data.Stock),
          }),
        });

        const body = (await res.json()) as any as IResponse;
        if (body.Error != "") {
          throw new Error(body.Error);
        }

        alert("Elemento modificado");
      } catch (error: any) {
        alert(error);
        throw new Error(error);
      }
    })();
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    actualizar_data((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div key={data.Id} className="card" style={{ width: "18rem" }}>
        <img
          src="/public/images/anonimo.jpg"
          className="card-img-top"
          alt="Chicago Skyscrapers"
        />
        <div className="card-body">
          <h5 className="card-title">{data.Nombre}</h5>
          <p className="card-text">{data.Descripcion}</p>
        </div>
        <ul className="list-group list-group-light list-group-small">
          <li className="list-group-item px-4">
            Precio:{" "}
            {tipo.aud == Persona.Cliente_tipo ? (
              <p>{data.Precio}</p>
            ) : (
              <input
                type="number"
                name="Precio"
                min={0}
                value={Number(data.Precio)}
                onChange={handleChange}
              />
            )}
          </li>
          <li className="list-group-item px-4">
            Minimo puntos:{" "}
            {tipo.aud == Persona.Cliente_tipo ? (
              <p>{data.Min_Puntos}</p>
            ) : (
              <input
                type="number"
                name="Puntos"
                min={0}
                value={Number(data.Min_Puntos)}
                onChange={handleChange}
              />
            )}
          </li>
          <li className="list-group-item px-4">
            Stock:{" "}
            {tipo.aud == Persona.Cliente_tipo ? (
              <p>{data.Stock}</p>
            ) : (
              <input
                type="number"
                name="Stock"
                min={0}
                value={Number(data.Stock)}
                onChange={handleChange}
              />
            )}
          </li>
        </ul>
        <div className="card-body">
          {tipo.aud == Persona.Cliente_tipo &&
          data.Stock > 0 &&
          tipo.sub.Puntos >= data.Min_Puntos ? (
            <button
              className="card-link btn btn-primary"
              onClick={() => AgregarCarrito(data.Id)}
            >
              Agregar a carrito
            </button>
          ) : null}

          {tipo.aud == Persona.Florista_tipo ? (
            <button
              className="card-link btn btn-primary"
              onClick={() => ModificarBeneficio(data.Id)}
            >
              Modificar
            </button>
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
