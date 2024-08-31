import { useEffect, useState } from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useLoaderData,
} from "react-router-dom";
import { CrearProducto } from "../data/producto";
import { HOST } from "../data/http";
import { IResponse } from "../interfaces/http";
import { COOKIE_TOKEN } from "../data/token";
import Cookies from "js-cookie";
import { ICategoria } from "../models/categoria";
import { RegistrarTrabajador } from "../models/persona";
import { Persona } from "../data/persona";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as any as RegistrarTrabajador;

  console.log(data);
  
  try {
    const res = await fetch(HOST + "/persona/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        Nombres: data.Nombres,
        Apellidos: data.Apellidos,
        Dni: data.Dni,
        Direccion: data.Direccion,
        Telefono: data.Telefono,
        Correo: data.Correo,
        Contraseña: data.Contraseña,
        TipoPersona: Number(data.TipoPersona),
        Placa: data.Placa,
      }),
    });

    const body = (await res.json()) as any as IResponse;
    if (body.Error != "") {
      throw new Error(body.Error);
    }

    alert("Producto creado");
    return null;
  } catch (error: any) {
    alert("Error: " + error);
    throw new Response(error);
  }
};

export default function Registros() {
  const [trabajador, actualizar_trabajador] = useState<RegistrarTrabajador>({
    Nombres: "",
    Apellidos: "",
    Direccion: "",
    Dni: "",
    Correo: "",
    Contraseña: "",
    Telefono: "",
    Placa: "",
    TipoPersona: Persona.Florista_tipo,
  });

  // Al cambiar un valor del usuario
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    actualizar_trabajador((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <h1>REGISTRAR TRABAJADOR</h1>
      <Form method="post" className="d-grid gap-3">
        <div className="col-md-4 mb-3">
          <label>Nombres</label>
          <input
            name="Nombres"
            type="text"
            className="form-control"
            placeholder="Nombres..."
            value={trabajador.Nombres}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Apellidos</label>
          <input
            name="Apellidos"
            type="text"
            className="form-control"
            placeholder="Descripcion..."
            value={trabajador.Apellidos}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Correo</label>
          <input
            name="Correo"
            type="email"
            className="form-control"
            placeholder="Correo..."
            value={trabajador.Correo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Contraseña</label>
          <input
            name="Contraseña"
            type="password"
            minLength={8}
            className="form-control"
            placeholder="Contraseña..."
            value={trabajador.Contraseña}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Direccion</label>
          <input
            name="Direccion"
            type="text"
            min={0}
            className="form-control"
            placeholder="Direccion..."
            value={trabajador.Direccion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4 mb-3">
          <label>Dni</label>
          <input
            name="Dni"
            type="text"
            maxLength={8}
            className="form-control"
            placeholder="Dni..."
            value={trabajador.Dni}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4 mb-3">
          <label>Telefono</label>
          <input
            name="Telefono"
            type="text"
            maxLength={9}
            min={0}
            className="form-control"
            placeholder="Telefono..."
            value={trabajador.Telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4 mb-3">
          <label>Tipo trabajador</label>
          <select
            className="form-control form-control-sm"
            name="TipoPersona"
            onChange={handleChange}
            required
          >
            <option value={Persona.Florista_tipo} selected>
              Florista
            </option>
            <option value={Persona.Delivery_tipo}>Delivery</option>
          </select>
        </div>

        {trabajador.TipoPersona == Persona.Delivery_tipo ? (
          <div className="col-md-4 mb-3">
            <label>Placa</label>
            <input
              name="Placa"
              type="text"
              maxLength={6}
              min={6}
              className="form-control"
              placeholder="Placa..."
              value={trabajador.Placa}
              onChange={handleChange}
              required
            />
          </div>
        ) : null}

        <button type="submit" className="btn btn-primary w-50">
          Enviar
        </button>
      </Form>
    </>
  );
}
