import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { HOST } from "../data/http";
import { IResponse } from "../interfaces/http";
import { ElementoPedido, IPedido } from "../models/pedido";
import { COOKIE_TOKEN } from "../data/token";
import Cookies from "js-cookie";

export const loader: LoaderFunction = async ({ params }) => {
  // Extraer id pedido
  const { idpedido } = params;

  // Hacer un fetch de los datos del pedido
  try {
    const res = await fetch(HOST + "/pedido/" + idpedido, {
      headers: {
        Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
      },
    });

    const body = (await res.json()) as any as IResponse;

    if (body.Error != "") {
      throw new Error(body.Error);
    }

    const data = body.Data as IPedido;

    const res2 = await fetch(HOST + "/pedido/" + idpedido + "/elementos", {
      headers: {
        Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
      },
    });

    const body2 = (await res2.json()) as any as IResponse;

    if (body2.Error != "") {
      throw new Error(body.Error);
    }

    const data2 = body2.Data as ElementoPedido;

    return { pedido: data, elementos: data2 };
  } catch (error: any) {
    throw new Response(error);
  }
};

export const action: ActionFunction = async ({ params }) => {
  try {
    const { id, idpedido } = params;

    const res = await fetch(HOST + "/pedido/" + idpedido + "/florista/" + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
      },
    });

    const body = (await res.json()) as any as IResponse;
    console.log(body);

    if (body.Error != "") {
      throw new Error(body.Error);
    }

    alert("Pedido registrado");
    return redirect("");
  } catch (error: any) {
    throw new Response(error);
  }
};

export default function Pedido_Detalle() {
  const dataloader = useLoaderData() as any | null;
  if (dataloader == null) {
    return (
      <>
        <h1>ERROR DE EXTRACCION DE INFORMACION DE PEDIDO</h1>
      </>
    );
  }

  const pedido = dataloader.pedido as IPedido;
  const elementos = dataloader.elementos as ElementoPedido[];

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <p>
                <strong className="my-3">Cliente id: </strong>
                {pedido.Id_cliente}
              </p>
              <p>
                <strong className="my-3">Florista id: </strong>
                {pedido.Id_florista ?? "no asignado"}
              </p>
              <p>
                <strong className="my-3">Correo: </strong>
                {pedido.Correo}
              </p>
              <p>
                <strong className="my-3">Telefono: </strong>
                {pedido.Telefono}
              </p>
              <p>
                <strong className="my-3">Medio de pago: </strong>
                {pedido.Id_medio_pago}
              </p>
              <p>
                <strong className="my-3">Monto: </strong>
                {pedido.Monto}
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h4>ELEMENTOS</h4>
              <ul className="list-group list-group-light">
                {elementos.map((elemento) => (
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    {elemento.Nombre}
                    <span className="badge badge-primary rounded-pill">
                      {elemento.Cantidad}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {pedido.Id_florista == null ? (
          <Form method="post">
            <button className="btn btn-primary btn-rounded">Registrar</button>
          </Form>
        ) : null}
      </div>
    </div>
  );
}
