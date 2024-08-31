import { useEffect, useState } from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useLoaderData,
} from "react-router-dom";
import { CrearBeneficio, CrearProducto } from "../data/producto";
import { HOST } from "../data/http";
import { IResponse } from "../interfaces/http";
import { COOKIE_TOKEN } from "../data/token";
import Cookies from "js-cookie";
import { ICategoria } from "../models/categoria";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as any as CrearBeneficio;

  try {
    const res = await fetch(HOST + "/elemento/beneficio", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
      },
      body: JSON.stringify({
        Nombre: data.Nombre,
        Descripcion: data.Descripcion,
        Stock: Number(data.Stock),
        Precio: Number(data.Precio),
        Puntos: Number(data.Puntos),
        Imagen: data.Imagen,
      }),
    });

    const body = (await res.json()) as any as IResponse;
    if (body.Error != "") {
      throw new Error(body.Error);
    }

    alert("Beneficio creado");
    return null;
  } catch (error: any) {
    alert("Error: " + error);
    throw new Response(error);
  }
};

export default function Beneficio_Crear() {
  const categorias = useLoaderData() as ICategoria[];

  const [producto, actualizar_producto] = useState<CrearProducto>({
    Nombre: "",
    Descripcion: "",
    Stock: 0,
    Precio: 0,
    Puntos: 0,
    Categoria: -1,
    Imagen: "",
  });

  // Al cambiar un valor del usuario
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    actualizar_producto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(producto);
  }, [producto]);

  return (
    <>
      <h1>CREAR BENEFICIO</h1>
      <Form method="post" className="d-grid gap-3">
        <div className="col-md-4 mb-3">
          <label>Nombre</label>
          <input
            name="Nombre"
            type="text"
            className="form-control"
            placeholder="Nombre..."
            value={producto.Nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Descripcion</label>
          <input
            name="Descripcion"
            type="text"
            className="form-control"
            placeholder="Descripcion..."
            value={producto.Descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4 mb-3">
          <label>Stock</label>
          <input
            name="Stock"
            type="number"
            min={0}
            className="form-control"
            placeholder="Stock..."
            value={producto.Stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Precio</label>
          <input
            name="Precio"
            type="number"
            min={0}
            className="form-control"
            placeholder="Precio..."
            value={producto.Precio}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Minimo puntos</label>
          <input
            name="Puntos"
            type="number"
            min={0}
            className="form-control"
            placeholder="Puntos..."
            value={producto.Puntos}
            onChange={handleChange}
            required
          />
        </div>
        {/*         <div className="form-group d-grid w-50">
          <input
            name="Imagen"
            type="file"
            className="form-control-file"
            id="exampleFormControlFile1"
            value={producto.Imagen}
            onChange={(e) => {
              actualizar_producto((prev) => ({
                ...prev,
                Imagen: e.target.files![0].name,
              }));
            }}
          />
        </div> */}
        <button type="submit" className="btn btn-primary w-50">
          Enviar
        </button>
      </Form>
    </>
  );
}
