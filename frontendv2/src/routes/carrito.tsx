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
  ELEMENTO,
  ElementoDto,
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
import { jwtDecode } from "jwt-decode";
import { Token } from "../interfaces/token";
import { Persona } from "../data/persona";

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
      const data = body.Data as ElementoDto;

      return data;
    })
  );

  // Informacion de usuario
  const tokenString = Cookies.get(COOKIE_TOKEN);
  if (tokenString == undefined) {
    throw new Response("Aun no se ha logueado", { status: 401 });
  }

  // Decodificar token
  const tokenDecodificado = jwtDecode<Token>(tokenString);
  if (Date.now() >= tokenDecodificado.exp * 1000) {
    throw new Response("Token Expiro", { status: 401 });
  }

  return {
    tipo: tokenDecodificado.aud,
    datos: tokenDecodificado.sub,
    productosLista,
  };
};

interface IPago {
  Puntos_total: number;
  Monto: number;
  Id_cliente: number;
}

// Action
export const action: ActionFunction = async ({ params }) => {
  const elementos = JSON.parse(
    Cookies.get(CARRITO_COOKIE)!
  ) as any as ProductoCarrito[];

  let monto = 0;
  let puntos = 0;
  for (const elemento of elementos) {
    monto += elemento.Cantidad * elemento.Precio;
    puntos += elemento.Puntos * elemento.Cantidad;
  }

  // Validar monto
  if (monto == 0) {
    return null;
  }

  // Informacion de pago
  const informacion: IPago = {
    Puntos_total: puntos,
    Monto: monto,
    Id_cliente: Number(params.id),
  };

  // Guardar en cookies
  Cookies.set(COMPRA_COOKIE, JSON.stringify(informacion));

  return redirect("../pago");
};

// Componente
export default function Carrito() {
  const loaderData: {
    tipo: number;
    datos: any;
    productosLista: any;
  } = useLoaderData() as any;

  // Productos
  let [productosLista, actualizar_productosLista] = useState(
    loaderData.productosLista as ElementoDto[]
  );

  const [puntos_usuario, actualizar_puntos_usuario] = useState<number>(
    loaderData.datos.Puntos ?? 0
  );

  let productosCarrito = productosLista.map((prod) => {
    return {
      Id: prod.Id,
      Cantidad: 0,
      Precio: prod.Precio,
      Puntos: prod.Puntos,
      Tipo: prod.Tipo,
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
  function ActualizarProductoCantidad(
    e: any,
    id: number,
    cantidad: number,
    tipo: number
  ) {
    // Encontrar el indice del elemento a actualizar el valor
    let index = productosCarrito.findIndex((prod) => prod.Id == id);

    // No fue encontrado
    if (index == -1) {
      return;
    }

    // Tipo
    if (tipo == ELEMENTO.BENEFICIO_TIPO) {
      // Valor
      const value =
        loaderData.datos.Puntos - cantidad * productosCarrito[index].Puntos;

      if (value < 0) {
        e.target.value -= 1;
        return;
      }
      actualizar_puntos_usuario(value);
    }

    // Actualizar
    productosCarrito[index].Cantidad = cantidad;

    // Almacenar
    Cookies.set(CARRITO_COOKIE, JSON.stringify(productosCarrito));
  }

  // Renderizar el producto
  function ProductoCarrito(producto: ElementoDto) {
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
          alt={producto.Imagen}
        />
        <div className="card-body">
          <h5 className="card-title">{producto.Nombre}</h5>
          <p className="card-text">{producto.Descripcion}</p>
        </div>
        <ul className="list-group list-group-light list-group-small">
          <li className="list-group-item px-4">Precio: {producto.Precio}</li>
          <li className="list-group-item px-4">Puntos: {producto.Puntos}</li>
          <li className="list-group-item px-4">Stock: {producto.Stock}</li>
          <li className="list-group-item px-4">Tipo: {producto.Tipo}</li>
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
                ActualizarProductoCantidad(
                  e,
                  producto.Id,
                  Number(e.target.value),
                  producto.Tipo
                )
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
        <Form className="d-flex gap-3" method="post">
          <button
            type="submit"
            className="btn btn-success btn-rounded"
            data-mdb-ripple-init
          >
            Comprar
          </button>
          <p>Puntos: {puntos_usuario}</p>
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
