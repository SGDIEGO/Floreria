import {
  Link,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { HOST } from "../data/http";
import { COOKIE_TOKEN } from "../data/token";

import Cookies from "js-cookie";
import { IResponse } from "../interfaces/http";
import { PedidoDetalle } from "../models/pedido";
import { jwtDecode } from "jwt-decode";
import { Persona } from "../data/persona";

const estado_pedido = ["enlistado", "preparando", "en camino", "finalizado"];

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
  const usuario = jwtDecode(Cookies.get(COOKIE_TOKEN)!) as any;

  // Funcion para verificar el estado de pedido
  function EstadoPedido() {
    // Verificar si el pedido ya ha sido asignado a un florista
    if (pedido.Id_florista == null) {
      return <small className="text-muted">Estado: ENLISTADO</small>;
    }

    // Verificar si se le asigno delivery
    if (pedido.Id_delivery != null) {
      return <small className="text-muted">Estado: EN CAMINO</small>;
    }

    // En preparacion
    return <small className="text-muted">Estado: PREPARANDO</small>;
  }

  function AsignarDelivery(idpedido: number) {
    (async () => {
      try {
        const res = await fetch(HOST + "/pedido/" + idpedido + "/delivery", {
          method: "PUT",
          headers: { Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN) },
        });
        const body = (await res.json()) as any as IResponse;

        if (body.Error != "") {
          alert(body.Error);
          throw new Error(body.Error);
        }

        alert("Delivery asignado");
      } catch (error: any) {
        throw new Response(error);
      }
    })();
  }

  // Funcion para finalizar pedido
  function FinalizarPedido(idpedido: number) {
    (async () => {
      try {
        const res = await fetch(HOST + "/pedido/" + idpedido, {
          method: "PUT",
          headers: { Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN) },
        });
        const body = (await res.json()) as any as IResponse;

        if (body.Error != "") {
          alert(body.Error);
          throw new Error(body.Error);
        }

        alert("Pedido finalizado");
      } catch (error: any) {
        throw new Response(error);
      }
    })();
  }

  return (
    <div className="card mb-3" style={{ maxWidth: "540px" }}>
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src="/public/images/anonimo.jpg"
            alt="Pedido"
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
              <small className="text-muted">
                Fecha emision:{" "}
                {pedido.Fecha_emision.toString().substring(0, 10)}
              </small>
              <br />
              <small className="text-muted">
                Fecha entrega:{" "}
                {pedido.Fecha_entrega.toString().substring(0, 10)}
              </small>{" "}
              <br />
              <small className="text-muted">
                Estado: {estado_pedido[pedido.Id_estado - 1]}
              </small>
            </p>
          </div>
          {usuario.aud == Persona.Florista_tipo ? (
            <div className="d-flex gap-4">
              {pedido.Id_estado <= 2 ? (
                <Link
                  to="../"
                  className="btn btn-secondary"
                  onClick={() => AsignarDelivery(pedido.Id)}
                >
                  Asignar delivery
                </Link>
              ) : null}
              {pedido.Id_estado == 3 ? (
                <Link
                  to="../"
                  className="btn btn-danger"
                  onClick={() => FinalizarPedido(pedido.Id)}
                >
                  Finalizar
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
