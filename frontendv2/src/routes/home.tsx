import { useEffect, useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { Producto } from "../data/producto";
import { Beneficio } from "../data/beneficio";
import { HOST } from "../data/http";
import { IResponse } from "../interfaces/http";

export const loader: LoaderFunction = async function () {
  // Productos
  const res = await fetch(HOST + "/elemento/producto").catch((e) => {
    throw new Response(e, { status: 401 });
  });

  // Si respuesta tiene errores
  if (!res.ok) {
    throw new Response(res.statusText, {
      status: res.status,
    });
  }

  // Extraer body
  const body = (await res.json()) as any as IResponse;

  // Verificar errores
  if (body.Error != "") {
    throw new Response(body.Error, {
      status: res.status,
    });
  }

  // Beneficios
  const res2 = await fetch(HOST + "/elemento/beneficio").catch((e) => {
    throw new Response(e, { status: 401 });
  });

  // Si respuesta tiene errores
  if (!res2.ok) {
    throw new Response(res.statusText, {
      status: res.status,
    });
  }

  // Extraer body
  const body2 = (await res2.json()) as any as IResponse;

  // Verificar errores
  if (body2.Error != "") {
    throw new Response(body2.Error, {
      status: res2.status,
    });
  }

  return [body.Data, body2.Data];
};

export default function Home() {
  const [productos, beneficios] = useLoaderData() as [Producto[], Beneficio[]];
  const [categoria, actualizar_categoria] = useState("todos");

  // Cuando la categoria cambia
  function FiltrarPorCategoria(categoria: string) {
    switch (categoria) {
      case "todos":
      default:
    }
  }

  return (
    <>
      <div
        id="carouselExampleCaptions"
        className="carousel slide carousel-fade"
        data-mdb-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://floreriadaysi.com/wp-content/uploads/2020/07/fondo-p2.jpg"
              className="d-block w-100"
              style={{ maxHeight: "50rem" }}
              alt="Wild Landscape"
            />
            <div
              className="mask"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            ></div>
            <div className="carousel-caption d-none d-sm-block mb-5">
              <h1 className="mb-4">
                <strong>DISEÑA TU REGALO PERFECTO</strong>
              </h1>

              <p className="mb-4 d-none d-md-block">
                <strong>
                  "Porque cada día es una ocasión para regalar flores"
                </strong>
              </p>

              <a
                target="_blank"
                href="https://mdbootstrap.com/education/bootstrap/"
                className="btn btn-outline-white btn-lg"
              >
                ¡REGISTRATE PARA OBTENER BENEFICIOS!
                {/* <i className="fas fa-graduation-cap ms-2"></i> */}
              </a>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-mdb-target="#carouselExampleCaptions"
          data-mdb-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-mdb-target="#carouselExampleCaptions"
          data-mdb-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <main>
        <div className="container">
          <nav
            className="navbar navbar-expand-lg navbar-dark mt-3 mb-5 shadow p-2"
            style={{ backgroundColor: "#607D8B" }}
          >
            <div className="container-fluid">
              <h3 className="navbar-brand">Categorias:</h3>

              <button
                className="navbar-toggler"
                type="button"
                data-mdb-toggle="collapse"
                data-mdb-target="#navbarSupportedContent2"
                aria-controls="navbarSupportedContent2"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i className="fas fa-bars"></i>
              </button>

              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent2"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item acitve">
                    <button
                      className="nav-link text-white"
                      onClick={() => {
                        actualizar_categoria("todos");
                      }}
                    >
                      Todos
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link text-white"
                      onClick={() => {
                        actualizar_categoria("general");
                      }}
                    >
                      General
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link text-white"
                      onClick={() => {
                        actualizar_categoria("beneficios");
                      }}
                    >
                      Beneficio
                    </button>
                  </li>
                </ul>

                {/* <form className="w-auto py-1" style={{ maxWidth: "12rem" }}>
                  <input
                    type="search"
                    className="form-control rounded-0"
                    placeholder="Search"
                    aria-label="Search"
                  />
                </form> */}
              </div>
            </div>
          </nav>

          <section>
            <div className="text-center">
              {/* productos */}
              {categoria == "general" || categoria == "todos" ? (
                <div className="row">
                  {productos.map((producto) => (
                    <div className="col-lg-3 col-md-6 mb-4">
                      <div className="card">
                        <div
                          className="bg-image hover-zoom ripple ripple-surface ripple-surface-light"
                          data-mdb-ripple-color="light"
                        >
                          <img src={producto.Imagen} className="w-100" />
                          <a href="#!">
                            <div className="mask">
                              <div className="d-flex justify-content-start align-items-end h-100">
                                <h5>
                                  {/* <span className="badge bg-dark ms-2">Producto</span> */}
                                </h5>
                              </div>
                            </div>
                            <div className="hover-overlay">
                              <div
                                className="mask"
                                style={{
                                  backgroundColor: "rgba(251, 251, 251, 0.15)",
                                }}
                              ></div>
                            </div>
                          </a>
                        </div>
                        <div className="card-body">
                          <a href="" className="text-reset">
                            <h5 className="card-title mb-2">
                              {producto.Nombre}
                            </h5>
                          </a>
                          <a href="" className="text-reset ">
                            <p>{producto.Descripcion}</p>
                          </a>
                          <h6 className="mb-3 price">{producto.Precio}$</h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* beneficios */}
              {categoria == "todos" || categoria == "beneficios" ? (
                <div className="row">
                  {beneficios.map((beneficio) => (
                    <div className="col-lg-3 col-md-6 mb-4">
                      <div className="card">
                        <div
                          className="bg-image hover-zoom ripple ripple-surface ripple-surface-light"
                          data-mdb-ripple-color="light"
                        >
                          <img
                            src="https://cdn.pixabay.com/photo/2021/11/28/17/51/gift-6830908_1280.png"
                            className="w-100"
                          />
                          <a href="#!">
                            <div className="mask">
                              <div className="d-flex justify-content-start align-items-end h-100">
                                <h5>
                                  <span className="badge bg-dark ms-2">
                                    beneficio
                                  </span>
                                </h5>
                              </div>
                            </div>
                            <div className="hover-overlay">
                              <div
                                className="mask"
                                style={{
                                  backgroundColor: "rgba(251, 251, 251, 0.15)",
                                }}
                              ></div>
                            </div>
                          </a>
                        </div>
                        <div className="card-body">
                          <a href="" className="text-reset">
                            <h5 className="card-title mb-2">
                              {beneficio.Nombre}
                            </h5>
                          </a>
                          <a href="" className="text-reset ">
                            <p>{beneficio.Descripcion}</p>
                          </a>
                          <h6 className="mb-3 price">{beneficio.Precio}$</h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          {/* <nav
            aria-label="Page navigation example"
            className="d-flex justify-content-center mt-3"
          >
            <ul className="pagination">
              <li className="page-item disabled">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li className="page-item active">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  4
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  5
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav> */}
        </div>
      </main>

      <footer
        className="text-center text-white mt-4"
        style={{ backgroundColor: "#607D8B" }}
      >
        {/* <div className="pt-4 pb-2">
          <a
            className="btn btn-outline-white footer-cta mx-2"
            href="https://mdbootstrap.com/docs/jquery/getting-started/download/"
            target="_blank"
            role="button"
          >
            Download MDB
            <i className="fas fa-download ms-2"></i>
          </a>
          <a
            className="btn btn-outline-white footer-cta mx-2"
            href="https://mdbootstrap.com/education/bootstrap/"
            target="_blank"
            role="button"
          >
            Start free tutorial
            <i className="fas fa-graduation-cap ms-2"></i>
          </a>
        </div> */}

        <hr className="text-dark" />

        <div className="container">
          <section className="mb-3">
            <a
              className="btn-link btn-floating btn-lg text-white"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
            >
              <i className="fab fa-facebook-f"></i>
            </a>

            <a
              className="btn-link btn-floating btn-lg text-white"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
            >
              <i className="fab fa-twitter"></i>
            </a>

            <a
              className="btn-link btn-floating btn-lg text-white"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
            >
              <i className="fab fa-google"></i>
            </a>

            <a
              className="btn-link btn-floating btn-lg text-white"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
            >
              <i className="fab fa-instagram"></i>
            </a>

            <a
              className="btn-link btn-floating btn-lg text-white"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
            >
              <i className="fab fa-youtube"></i>
            </a>
            {/* <a
              className="btn-link btn-floating btn-lg text-white"
              href="#!"
              role="button"
              data-mdb-ripple-color="dark"
            >
              <i className="fab fa-github"></i>
            </a> */}
          </section>
        </div>

        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", color: "#E0E0E0" }}
        >
          © 2024 Copyright:
          <a className="text-white" href="https://mdbootstrap.com/">
            PrettyLove.com
          </a>
        </div>
      </footer>
    </>
  );
}
