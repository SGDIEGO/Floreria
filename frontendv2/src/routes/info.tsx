import { Link, LoaderFunction, useLoaderData } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Token } from "../interfaces/token";
import { COOKIE_TOKEN } from "../data/token";
import { Persona } from "../data/persona";
import { ActualizarPersona, ClienteDto, FloristaDto } from "../models/persona";
import { IResponse } from "../interfaces/http";
import { HOST } from "../data/http";
import { useState } from "react";

interface Pedido {
  Id: number;
  Monto: number;
  Fecha_emision: Date;
  Fecha_entrega: Date;
  Id_cliente: number;
  Id_medio_pago: number;
  Id_florista: number;
}

interface IDatosUsuario {
  tipo: number;
  datos: ClienteDto | FloristaDto;
  ultimasCompras: Pedido[];
}

export const loader: LoaderFunction = async function ({}) {
  // Verificar token
  const tokenString = Cookies.get(COOKIE_TOKEN);
  if (tokenString == undefined) {
    throw new Response("Aun no se ha logueado", { status: 401 });
  }

  // Decodificar token
  const tokenDecodificado = jwtDecode<Token>(tokenString);
  if (Date.now() >= tokenDecodificado.exp * 1000) {
    throw new Response("Token Expiro", { status: 401 });
  }

  // Verificar si es cliente o florista
  if (tokenDecodificado.aud == Persona.Florista_tipo) {
    // Ultimas compras registradas
    const response = await fetch(
      HOST + "/persona/florista/" + tokenDecodificado.sub.Id + "/pedidos/registrados",
      {
        headers: {
          Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
        },
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        throw new Response(e);
      });

    const body = response as IResponse;

    if (body.Error != "") {
      throw new Response(body.Error);
    }

    const pedidos: Pedido[] = body.Data ?? [];

    // Retornar
    return {
      tipo: tokenDecodificado.aud,
      datos: tokenDecodificado.sub,
      ultimasCompras: pedidos,
    };
  }

  // Fetch pedidos
  const response = await fetch(
    HOST + "/persona/usuario/" + tokenDecodificado.sub.Id + "/pedidos",
    {
      headers: {
        Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
      },
    }
  )
    .then((res) => res.json())
    .catch((e) => {
      throw new Response(e);
    });

  const body = response as IResponse;

  if (body.Error != "") {
    throw new Response(body.Error);
  }

  const pedidos: Pedido[] = body.Data ?? [];

  return {
    tipo: tokenDecodificado.aud,
    datos: tokenDecodificado.sub,
    ultimasCompras: pedidos,
  };
};

export default function Info() {
  const informacionUsuario = useLoaderData() as IDatosUsuario;

  const [usuario, actualizar_usuario] = useState(informacionUsuario.datos);

  // Al cambiar un valor del usuario
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    actualizar_usuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Click de boton para actualizar datos
  const handleUpdateClick = async () => {
    const data: ActualizarPersona = {
      Nombres: usuario.Nombres,
      Apellidos: usuario.Apellidos,
      Correo: usuario.Correo,
      Direccion: usuario.Direccion,
      Telefono: usuario.Telefono,
    };

    // Fetch
    const res = await fetch(
      HOST + "/persona/usuario/" + informacionUsuario.datos.Id,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
        },
        body: JSON.stringify(data),
      }
    ).catch((e) => {
      throw new Response(e, { status: 401 });
    });

    // Extraer response
    const body = (await res.json()) as any as IResponse;
    if (body.Error != "") {
      throw new Response(body.Error);
    }

    // Datos actualizados
    alert("Datos actualizados");
  };

  return (
    <>
      <section style={{ backgroundColor: "#eee" }}>
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                    alt="avatar"
                    className="rounded-circle img-fluid"
                    style={{ width: "150px" }}
                  />
                  {informacionUsuario.tipo == Persona.Cliente_tipo ? (
                    <h5 className="my-3">Cliente</h5>
                  ) : (
                    <h5 className="my-3">Florista</h5>
                  )}
                  {/* <p className="text-muted mb-1">Full Stack Developer</p> */}
                  <p className="text-muted mb-4">
                    {informacionUsuario.datos.Correo}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Nombres</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        <input
                          className="w-100"
                          type="text"
                          name="Nombres"
                          value={usuario.Nombres}
                          onChange={handleChange}
                        />
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Apellidos</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        <input
                          className="w-100"
                          type="text"
                          name="Apellidos"
                          value={usuario.Apellidos}
                          onChange={handleChange}
                        />
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Correo</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        <input
                          className="w-100"
                          type="text"
                          name="Correo"
                          value={usuario.Correo}
                          onChange={handleChange}
                        />
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Telefono</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        <input
                          className="w-100"
                          type="text"
                          name="Telefono"
                          value={usuario.Telefono}
                          onChange={handleChange}
                        />
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Direccion</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        <input
                          className="w-100"
                          type="text"
                          name="Direccion"
                          value={usuario.Direccion}
                          onChange={handleChange}
                        />
                      </p>
                    </div>
                  </div>
                  {informacionUsuario.tipo == Persona.Cliente_tipo ? (
                    <>
                      <hr />
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="mb-0">Puntos</p>
                        </div>
                        <div className="col-sm-9">
                          <p className="text-muted mb-0">
                            {(informacionUsuario.datos as ClienteDto).Puntos}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : null}
                  <hr />
                  <div className="row">
                    <button
                      className="btn btn-secondary w-50"
                      onClick={handleUpdateClick}
                    >
                      Actualizar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {informacionUsuario.tipo == Persona.Cliente_tipo ? (
            <>
              {" "}
              <h5>ULTIMAS COMPRAS</h5>
              <div className="row">
                {informacionUsuario.ultimasCompras.map((pedido) => (
                  <div className="col-md-4">
                    <div className="card mb-4 mb-md-0">
                      <div className="card-body">
                        <p className="mb-4">Id de pedido: {pedido.Id}</p>
                        <p className="mb-1" style={{ fontSize: ".77rem" }}>
                          Monto: {pedido.Monto}
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "0%" }}
                            aria-valuenow={80}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                        <p className="mb-1" style={{ fontSize: ".77rem" }}>
                          Emitido: {pedido.Fecha_emision.toString()}
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "0%" }}
                            aria-valuenow={80}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                        <p className="mb-1" style={{ fontSize: ".77rem" }}>
                          Entrega estimada: {pedido.Fecha_entrega.toString()}
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "0%" }}
                            aria-valuenow={80}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                        <Link to={"pedidos/" + pedido.Id}>
                          <button className="btn btn-outline-info btn-rounded">
                            Detalles
                          </button>
                        </Link>
                      </div>
                      <div></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
          {informacionUsuario.tipo == Persona.Florista_tipo ? (
            <>
              {" "}
              <h5>COMPRAS REGISTRADAS</h5>
              <div className="row">
                {informacionUsuario.ultimasCompras.map((pedido) => (
                  <div className="col-md-4">
                    <div className="card mb-4 mb-md-0">
                      <div className="card-body">
                        <p className="mb-4">Id de pedido: {pedido.Id}</p>
                        <p className="mb-1" style={{ fontSize: ".77rem" }}>
                          Monto: {pedido.Monto}
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "0%" }}
                            aria-valuenow={80}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                        <p className="mb-1" style={{ fontSize: ".77rem" }}>
                          Emitido: {pedido.Fecha_emision.toString()}
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "0%" }}
                            aria-valuenow={80}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                        <p className="mb-1" style={{ fontSize: ".77rem" }}>
                          Entrega estimada: {pedido.Fecha_entrega.toString()}
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "0%" }}
                            aria-valuenow={80}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                        <Link to={"pedidos/" + pedido.Id}>
                          <button className="btn btn-outline-info btn-rounded">
                            Detalles
                          </button>
                        </Link>
                      </div>
                      <div></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
