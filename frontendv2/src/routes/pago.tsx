import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { CARRITO_COOKIE, COMPRA_COOKIE, COOKIE_TOKEN } from "../data/token";
import Cookies from "js-cookie";
import { CompraDto, ProductoCarrito } from "../data/producto";
import { useState } from "react";
import { HOST } from "../data/http";
import { IResponse } from "../interfaces/http";

interface IPago {
  Monto: number;
  Id_cliente: number;
}

export const loader: LoaderFunction = async function ({}) {
  // Cargar data de cookies
  const compra = JSON.parse(Cookies.get(COMPRA_COOKIE)!) as any as IPago | null;

  if (compra == null) {
    return redirect("../carrito");
  }

  return compra;
};

export default function Pago() {
  const datos = useLoaderData() as IPago;
  const [metodos_pago, actualizar_metodos_pago] = useState(3);

  function RealizarCompra() {
    const compra = JSON.parse(
      Cookies.get(COMPRA_COOKIE)!
    ) as any as IPago | null;

    const elementos = JSON.parse(
      Cookies.get(CARRITO_COOKIE)!
    ) as any as ProductoCarrito[];

    const dataPedido: CompraDto = {
      Monto: compra?.Monto!,
      Fecha_entrega: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3),
      Fecha_emision: new Date(),
      Id_cliente: compra?.Id_cliente!,
      Id_medio_pago: metodos_pago,
      Id_florista: -1,
      Elementos: elementos.map((elemento) => {
        return {
          Id: elemento.Id,
          Cantidad: elemento.Cantidad,
        };
      }),
    };

    fetch(HOST + "/persona/usuario/:id/pago", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
      },
      body: JSON.stringify(dataPedido),
    })
      .then((res) => res.json())
      .then((body) => {
        const data = body as IResponse;
        console.log(body);

        if (data.Error != "") {
          throw new Error(data.Error);
        }

        alert("Compra registrada");
      })
      .catch((e) => {
        throw new Response(e, {
          status: 401,
        });
      });

    Cookies.remove(COMPRA_COOKIE);
  }

  function CancelarCompra() {
    Cookies.remove(COMPRA_COOKIE);
  }

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-12 col-lg-10 col-xl-8">
            <div className="card">
              <div className="card-body p-md-5">
                <div>
                  <h4>RESUMEN DE COMPRA</h4>
                  <p className="text-muted pb-2">
                    Muchas gracias por su preferencias, seleccione un medio de
                    pago.
                  </p>
                </div>

                <div className="px-3 py-4 border border-primary border-2 rounded mt-4 d-flex justify-content-between">
                  <div className="d-flex flex-row align-items-center">
                    <img
                      src="https://i.imgur.com/S17BrTx.webp"
                      className="rounded"
                      width="60"
                    />
                    <div className="d-flex flex-column ms-4">
                      <span className="h5 mb-1">Monto de pago</span>
                      <span className="small text-muted">Compra</span>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <sup className="dollar font-weight-bold text-muted">S/</sup>
                    <span className="h2 mx-1 mb-0">{datos.Monto}</span>
                    <span className="text-muted font-weight-bold mt-2">
                      / year
                    </span>
                  </div>
                </div>

                <h4 className="mt-5">Payment details</h4>

                <div className="mt-4 d-flex justify-content-between align-items-center">
                  <div className="d-flex flex-row align-items-center">
                    <img
                      src="https://i.imgur.com/qHX7vY1.webp"
                      className="rounded"
                      width="70"
                    />
                    <div className="d-flex flex-column ms-3">
                      <span className="h5 mb-1">Tarjeta</span>
                      <span className="small text-muted">
                        1234 XXXX XXXX 2570
                      </span>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="CVC"
                      style={{ width: "70px" }}
                    />
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name="tarjeta"
                      onClick={() => actualizar_metodos_pago(1)}
                    />
                  </div>
                </div>

                <div className="mt-2 d-flex justify-content-between align-items-center">
                  <div className="d-flex flex-row align-items-center">
                    <img
                      src="https://i.imgur.com/qHX7vY1.webp"
                      className="rounded"
                      width="70"
                    />
                    <div className="d-flex flex-column ms-3">
                      <span className="h5 mb-1">Yape</span>
                      <span className="small text-muted">
                        2344 XXXX XXXX 8880
                      </span>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="CVC"
                      style={{ width: "70px" }}
                    />
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name="yape"
                      onClick={() => actualizar_metodos_pago(2)}
                    />
                  </div>
                </div>

                <h6 className="mt-4 mb-3 text-primary text-uppercase">
                  Agregar metodos de pago
                </h6>

                <div data-mdb-input-init className="form-outline">
                  <input
                    type="text"
                    id="formControlLg"
                    className="form-control form-control-lg"
                  />
                  <label className="form-label" htmlFor="formControlLg">
                    Correo electronico
                  </label>
                </div>
                <div className="mt-3">
                  <Link
                    to={".."}
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-primary btn-block btn-lg"
                    onClick={() => {
                      RealizarCompra();
                    }}
                  >
                    Realizar pago{" "}
                    <i className="fas fa-long-arrow-alt-right"></i>
                  </Link>
                  <Link
                    to={".."}
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-danger btn-block btn-lg"
                    onClick={() => {
                      CancelarCompra();
                    }}
                  >
                    Cancelar pago{" "}
                    <i className="fas fa-long-arrow-alt-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
