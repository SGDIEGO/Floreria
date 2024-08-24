import { LoaderFunction, useLoaderData } from "react-router-dom";
import { HOST } from "../data/http";
import { COOKIE_TOKEN } from "../data/token";

import Cookies from "js-cookie";
import { IResponse } from "../interfaces/http";
import { PedidoDetalle } from "../models/pedido";

export const loader: LoaderFunction = async ({ params }) => {
  const { id, idpedido } = params;

  const res = await fetch(
    HOST + "/persona/usuario/" + id + "/pedidos/" + idpedido,
    {
      headers: {
        Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
      },
    }
  )
    .then((r) => r.json())
    .catch((e) => {
      throw new Response(e);
    });

  const body = res as IResponse;
  if (body.Error != "") {
    throw new Response(body.Error);
  }

  const data = body.Data as PedidoDetalle;

  return data;
};

export default function Pedido() {
  const pedido = useLoaderData() as PedidoDetalle;
  console.log(pedido);

  return (
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
            <h6>Contenido:</h6>
            <p className="card-text">
              {pedido.Elementos.map((el) => (
                <div>
                  <strong>{el.Nombre}</strong> <br />
                  {el.Descripcion}
                </div>
              ))}
            </p>
            <p className="card-text">
              <small className="text-muted">Fecha entrega: {pedido.Fecha_entrega.toString()}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
