import { LoaderFunction, useLoaderData } from "react-router-dom";
import { CARRITO_COOKIE, COOKIE_TOKEN } from "../data/token";
import Cookies from "js-cookie";
import { IResponse } from "../interfaces/http";

import "./productos.css";
import react from "react";
import { Beneficio } from "../data/beneficio";
import BeneficioComponente from "../components/beneficio";

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
  let res = await fetch("http://localhost:3000/elemento/beneficio", {
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

export default function Beneficios() {
  // Productos cargados
  const beneficios = useLoaderData() as Beneficio[];

  // Usestates para la busqueda
  const [busqueda, actualizar_busqueda] = react.useState("");
  const [categoria, actualizar_categoria] = react.useState("");

  // Filtrar productos
  function FiltrarBeneficios(b: IBusqueda) {
    if (busqueda == "")
      return beneficios.map((beneficio) => (
        <BeneficioComponente
          Id={beneficio.Id}
          Nombre={beneficio.Nombre}
          Descripcion={beneficio.Descripcion}
          Stock={beneficio.Stock}
          Precio={beneficio.Precio}
          Min_Puntos={beneficio.Min_Puntos}
          Productos={beneficio.Productos}
        />
      ));

    // Renderizar por categoria
    switch (categoria) {
      case "id":
        return beneficios
          .filter((ben) => ben.Id == Number(b.valor))
          .map((beneficio) => (
            <BeneficioComponente
              Id={beneficio.Id}
              Nombre={beneficio.Nombre}
              Descripcion={beneficio.Descripcion}
              Stock={beneficio.Stock}
              Precio={beneficio.Precio}
              Min_Puntos={beneficio.Min_Puntos}
              Productos={beneficio.Productos}
            />
          ));

      case "nombre":
        return beneficios
          .filter((ben) => ben.Nombre.includes(b.valor))
          .map((beneficio) => (
            <BeneficioComponente
              Id={beneficio.Id}
              Nombre={beneficio.Nombre}
              Descripcion={beneficio.Descripcion}
              Stock={beneficio.Stock}
              Precio={beneficio.Precio}
              Min_Puntos={beneficio.Min_Puntos}
              Productos={beneficio.Productos}
            />
          ));

      case "descripcion":
        return beneficios
          .filter((ben) => ben.Descripcion.includes(b.valor))
          .map((beneficio) => (
            <BeneficioComponente
              Id={beneficio.Id}
              Nombre={beneficio.Nombre}
              Descripcion={beneficio.Descripcion}
              Stock={beneficio.Stock}
              Precio={beneficio.Precio}
              Min_Puntos={beneficio.Min_Puntos}
              Productos={beneficio.Productos}
            />
          ));

      default:
        return beneficios.map((beneficio) => (
          <BeneficioComponente
            Id={beneficio.Id}
            Nombre={beneficio.Nombre}
            Descripcion={beneficio.Descripcion}
            Stock={beneficio.Stock}
            Precio={beneficio.Precio}
            Min_Puntos={beneficio.Min_Puntos}
            Productos={beneficio.Productos}
          />
        ));
    }
  }

  // Renderizar productos
  return (
    <div className="w-100 ">
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
        <FiltrarBeneficios key={categoria} valor={busqueda} />
      </div>
    </div>
  );
}
