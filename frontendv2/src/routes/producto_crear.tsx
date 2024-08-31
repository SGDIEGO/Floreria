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

export const loader: LoaderFunction = async function ({}) {
  try {
    // Cargar categorias
    const res = await fetch(HOST + "/elemento/categorias", {
      method: "GET",
    });

    const body = (await res.json()) as any as IResponse;

    if (body.Error != "") {
      throw new Error(body.Error);
    }

    return body.Data;
  } catch (error: any) {
    alert(error);
    throw new Response(error);
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as any as CrearProducto;

  try {
    const res = await fetch(HOST + "/elemento/producto", {
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
        Categoria: Number(data.Categoria),
        Imagen: data.Imagen,
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

export default function Producto_Crear() {
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
      <h1>CREAR PRODUCTO</h1>
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
          <label>Categoria</label>
          <select
            className="form-control form-control-sm"
            name="Categoria"
            onChange={handleChange}
            required
          >
            <option value={-1} selected>
              ---
            </option>
            {categorias.map((cat) => (
              <option value={cat.Id}>{cat.Nombre}</option>
            ))}
          </select>
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
          <label>Puntos</label>
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
