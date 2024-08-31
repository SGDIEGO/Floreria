import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  useLoaderData,
} from "react-router-dom";
import { HOST } from "../data/http";
import { COOKIE_TOKEN } from "../data/token";

import Cookies from "js-cookie";
import { IResponse } from "../interfaces/http";
import { IPedido } from "../models/pedido";

export const loader: LoaderFunction = async ({ params }) => {
  const res = await fetch(HOST + "/persona/florista/pedidos", {
    headers: {
      Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
    },
  })
    .then((r) => r.json())
    .catch((e) => {
      throw new Response(e);
    });

  console.log(res);

  const body = res as IResponse;
  if (body.Error != "") {
    throw new Response(body.Error);
  }

  return body.Data;
};

export default function Pedidos() {
  const pedidos = useLoaderData() as IPedido[];

  if (pedidos == null)
    return (
      <>
        <h1>NO HAY PEDIDOS PENDIENTES DE REGISTRO</h1>
      </>
    );
  return (
    <>
      {pedidos.map((pedido) => (
        <div className="card mb-3" style={{ maxWidth: "540px" }}>
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src="data:image/png;base64,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"
                alt="Pedido"
                className="img-fluid rounded-start"
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">Id de pedido: {pedido.Id}</h5>
                <p className="card-text">
                  <strong>Cliente:</strong> {pedido.Id_cliente} <br />
                  <strong>Medio pago:</strong> {pedido.Id_medio_pago} <br />
                  <small className="text-muted">
                    Fecha entrega: {pedido.Fecha_entrega.toString()}
                  </small>
                </p>
                <div className="d-flex gap-3 ">
                  <Link
                    to={String(pedido.Id)}
                    className="btn btn-info btn-rounded"
                  >
                    Detalles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
