import { LoaderFunction, useLoaderData } from "react-router-dom";
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

  // Funcion para registrar pedido como propio
  function RegistrarPedido(id: number) {
    
  }

  return (
    <>
      {pedidos.map((pedido) => (
        <div className="card mb-3" style={{ maxWidth: "540px" }}>
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src="https://mdbcdn.b-cdn.net/wp-content/uploads/2020/06/vertical.webp"
                alt="Trendy Pants and Shoes"
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
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => RegistrarPedido(pedido.Id)}
                  >
                    Registrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
