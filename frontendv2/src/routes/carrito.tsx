import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router-dom";

import Cookies from "js-cookie";
import { CARRITO_COOKIE, COMPRA_COOKIE, COOKIE_TOKEN } from "../data/token";
import {
  ComprarElementoDto,
  Producto,
  ProductoCarrito,
} from "../data/producto";
import { HOST } from "../data/http";
import { IResponse } from "../interfaces/http";
import { useEffect, useState } from "react";

import "./carrito.css";
import Notificacion from "../components/notificacion";
import { NotificacionTipo } from "../data/notificacion";
import React from "react";

// Loader
export const loader: LoaderFunction = async function ({}) {
  // Ids
  const productosSaved = JSON.parse(
    Cookies.get(CARRITO_COOKIE)!
  ) as any as ProductoCarrito[];

  // Recorrer ids y resolver las promesas
  let productosLista = await Promise.all(
    productosSaved.map(async (prod) => {
      // Fetch
      const body = await fetch(HOST + "/elemento/" + prod.Id, {
        headers: {
          Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
        },
      })
        .then((res) => res.json())
        .catch((e) => {
          throw new Response(e, {
            status: 401,
          });
        });

      // Body
      if (body.Error != "") {
        throw new Response(body.Error, {
          status: 401,
        });
      }

      // Extraer data
      const data = body.Data as Producto;

      return data;
    })
  );

  return productosLista;
};

interface IPago {
  Monto: number;
  Id_cliente: number;
}

// Action
export const action: ActionFunction = async ({ params }) => {
  const elementos = JSON.parse(
    Cookies.get(CARRITO_COOKIE)!
  ) as any as ProductoCarrito[];

  let monto = 0;

  for (const elemento of elementos) {
    monto += elemento.Cantidad * elemento.Precio;
  }

  // Validar monto
  if (monto == 0) {
    return null;
  }

  // Informacion de pago
  const informacion: IPago = {
    Monto: monto,
    Id_cliente: Number(params.id),
  };

  // Guardar en cookies
  Cookies.set(COMPRA_COOKIE, JSON.stringify(informacion));

  return redirect("../pago");
};

// Componente
export default function Carrito() {
  // Productos
  let [productosLista, actualizar_productosLista] = useState(
    useLoaderData() as Producto[]
  );

  let productosCarrito = productosLista.map((prod) => {
    return {
      Id: prod.Id,
      Cantidad: 0,
      Precio: prod.Precio,
    };
  });

  // Response del action
  const [tipoNotificacion, actualizar_tipoNotificacion] = useState(-1);
  const [mensajeNotificacion, actualizar_mensajeNotificacion] = useState("");
  const [responseNotificacion, actualizar_responseNotificacion] =
    useState(false);

  // Cuando el valor de responseNotificacion cambie
  useEffect(() => {
    // Si es que acepto la compra
    if (responseNotificacion) {
      // Extraer datos de compra del almacenamiento local
      const elementos = JSON.parse(
        Cookies.get(CARRITO_COOKIE)!
      ) as any as ProductoCarrito[];

      // Recorrer cada producto en carrito
      elementos.forEach(async (elemento) => {
        console.log(elemento);

        let b: ComprarElementoDto = {
          Stock: elemento.Cantidad,
        };

        // Fetch
        const body = await fetch(HOST + "/elemento/" + elemento.Id, {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
          },
          body: JSON.stringify(b),
        })
          .then((res) => res.json())
          .catch((e) => {
            throw new Response(e, {
              status: 401,
            });
          });

        // Body
        if (body.Error != "") {
          throw new Response(body.Error, {
            status: 401,
          });
        }
      });

      // Notificacion de success
      actualizar_tipoNotificacion(NotificacionTipo.Sucessfull);
      actualizar_mensajeNotificacion("Compra registrada exitosamente");
      actualizar_responseNotificacion(false);
    }
  }, [responseNotificacion]);

  // Evento para eliminar el producto de carrito
  function EliminarProductoCarrito(id: number) {
    // Eliminar producto
    productosLista = productosLista.filter((producto) => producto.Id != id);
    productosCarrito = productosCarrito.filter((producto) => producto.Id != id);

    // Actualizar productos
    actualizar_productosLista(productosLista);

    // Actualizar los datos del arreglo en memoria local
    Cookies.set(CARRITO_COOKIE, JSON.stringify(productosCarrito));
  }

  // Evento para actualizar cantidad de producto
  function ActualizarProductoCantidad(id: number, cantidad: number) {
    // Encontrar el indice del elemento a actualizar el valor
    let index = productosCarrito.findIndex((prod) => prod.Id == id);

    // No fue encontrado
    if (index == -1) {
      return;
    }

    // Actualizar
    productosCarrito[index].Cantidad = cantidad;

    // Almacenar
    Cookies.set(CARRITO_COOKIE, JSON.stringify(productosCarrito));
  }

  // Renderizar el producto
  function ProductoCarrito(producto: Producto) {
    return (
      <div
        key={producto.Id}
        className="card card-carrito"
        style={{ width: "18rem" }}
      >
        <button
          className="card-carrito__close btn btn-primary btn-floating"
          onClick={() => EliminarProductoCarrito(producto.Id)}
        >
          X
        </button>
        <img
          src={producto.Imagen}
          className="card-img-top"
          alt="Chicago Skyscrapers"
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
          <div
            data-mdb-input-init
            className="form-outline"
            style={{ border: "1px black solid", borderRadius: ".5rem" }}
          >
            <input
              type="number"
              id="typeNumber"
              className="form-control"
              min={0}
              max={100}
              onChange={(e) =>
                ActualizarProductoCantidad(producto.Id, Number(e.target.value))
              }
            />
            <label className="form-label" style={{ background: "white" }}>
              Cantidad
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div id="carrito-main">
        {productosLista.map((producto) => ProductoCarrito(producto))}
      </div>
      <div>
        <Form method="post">
          <button
            type="submit"
            className="btn btn-success btn-rounded"
            data-mdb-ripple-init
          >
            Comprar
          </button>
        </Form>
      </div>
      {tipoNotificacion != -1 ? (
        <Notificacion
          tipo={tipoNotificacion}
          mensaje={mensajeNotificacion}
          actualizar_tipoNotificacion={actualizar_tipoNotificacion}
          actualizar_responseNotificacion={actualizar_responseNotificacion}
        />
      ) : null}
    </div>
  );
}
