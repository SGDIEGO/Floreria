import { LoaderFunction, useLoaderData } from "react-router-dom";
import { CARRITO_COOKIE, COOKIE_TOKEN } from "../data/token";
import Cookies from "js-cookie";
import { Producto } from "../data/producto";
import { IResponse } from "../interfaces/http";

import ProductoComponente from "../components/producto";
import { useState } from "react";

// Interfaces
interface IBusqueda {
  valor: string;
  key: string;
}

export const loader: LoaderFunction = async function ({}) {
  // Verificar que la cookie para el carrito esta registrada
  if (!Cookies.get(CARRITO_COOKIE)) {
    Cookies.set(CARRITO_COOKIE, "[]");
  }

  // Verificar token
  const tokenString = Cookies.get(COOKIE_TOKEN);
  if (tokenString == undefined) {
    throw new Response("Aun no se ha logueado", { status: 401 });
  }

  // Realizar fetch para el retorno de productos
  let res = await fetch("http://localhost:3000/elemento/producto", {
    headers: {
      Authorization: "Bearer " + tokenString,
    },
  }).catch((e) => {
    throw new Response(e, { status: 500 });
  });

  // Si respuesta tiene errores
  if (!res.ok) {
    throw new Response(res.statusText, {
      status: res.status,
    });
  }

  // Extraer body
  const body = (await res.json()) as any as IResponse;

  // Verificar errores
  if (body.Error != "") {
    throw new Response(body.Error, {
      status: res.status,
    });
  }

  // Extraer datos
  return body.Data;
};

export default function Productos() {
  // Productos cargados
  const productos = useLoaderData() as Producto[];

  // Usestates para la busqueda
  const [busqueda, actualizar_busqueda] = useState("");
  const [categoria, actualizar_categoria] = useState("");

  // Filtrar productos
  function FiltrarProductos(b: IBusqueda) {
    if (busqueda == "")
      return productos.map((producto) => (
        <ProductoComponente
          Id={producto.Id}
          Nombre={producto.Nombre}
          Descripcion={producto.Descripcion}
          Stock={producto.Stock}
          Precio={producto.Precio}
          Puntos={producto.Puntos}
          Imagen={producto.Imagen}
          Categoria={producto.Categoria}
        />
      ));

    // Renderizar por categoria
    switch (categoria) {
      case "id":
        return productos
          .filter((prod) => prod.Id == Number(b.valor))
          .map((producto) => (
            <ProductoComponente
              Id={producto.Id}
              Nombre={producto.Nombre}
              Descripcion={producto.Descripcion}
              Stock={producto.Stock}
              Precio={producto.Precio}
              Puntos={producto.Puntos}
              Imagen={producto.Imagen}
              Categoria={producto.Categoria}
            />
          ));

      case "nombre":
        return productos
          .filter((prod) => prod.Nombre.includes(b.valor))
          .map((producto) => (
            <ProductoComponente
              Id={producto.Id}
              Nombre={producto.Nombre}
              Descripcion={producto.Descripcion}
              Stock={producto.Stock}
              Precio={producto.Precio}
              Puntos={producto.Puntos}
              Imagen={producto.Imagen}
              Categoria={producto.Categoria}
            />
          ));

      case "descripcion":
        return productos
          .filter((prod) => prod.Descripcion.includes(b.valor))
          .map((producto) => (
            <ProductoComponente
              Id={producto.Id}
              Nombre={producto.Nombre}
              Descripcion={producto.Descripcion}
              Stock={producto.Stock}
              Precio={producto.Precio}
              Puntos={producto.Puntos}
              Imagen={producto.Imagen}
              Categoria={producto.Categoria}
            />
          ));

      default:
        return productos.map((producto) => (
          <ProductoComponente
            Id={producto.Id}
            Nombre={producto.Nombre}
            Descripcion={producto.Descripcion}
            Stock={producto.Stock}
            Precio={producto.Precio}
            Puntos={producto.Puntos}
            Imagen={producto.Imagen}
            Categoria={producto.Categoria}
          />
        ));
    }
  }

  // Renderizar productos
  return (
    <div className="w-100">
      <div className="d-flex w-50">
        <form className="d-none d-md-flex input-group w-auto my-auto">
          <input
            autoComplete="off"
            type="search"
            value={busqueda}
            className="form-control rounded"
            placeholder="Busqueda..."
            style={{ minWidth: "225px" }}
            onChange={(e) => actualizar_busqueda(e.target.value)}
          />
          <span className="input-group-text border-0">
            <button className="fas fa-search border border-0"></button>
          </span>
        </form>

        <select
          className="form-select"
          aria-label="Default select example"
          value={categoria}
          onChange={(e) => actualizar_categoria(e.target.value)}
        >
          <option selected value="">
            {" "}
            - - -{" "}
          </option>
          <option value="id">Id</option>
          <option value="nombre">Nombre</option>
          <option value="descripcion">Descripcion</option>
        </select>
      </div>
      <div className="d-flex flex-wrap w-auto gap-3 mt-3">
        <FiltrarProductos key={categoria} valor={busqueda} />
      </div>
    </div>
  );
}
