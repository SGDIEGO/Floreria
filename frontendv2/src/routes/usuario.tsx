import { Link, LoaderFunction, Params, useLoaderData } from "react-router-dom";
import { COOKIE_TOKEN } from "../data/token";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Token } from "../interfaces/token";
import { Persona } from "../data/persona";
import Cliente from "../components/cliente";
import Florista from "../components/florista";

import "./usuario.css";
import { useState } from "react";

// Loader para la carga de pagina
export const loader: LoaderFunction = async function ({
  params,
}: {
  params: Params<"id">;
}) {
  // Verificar token
  const tokenString = Cookies.get(COOKIE_TOKEN);
  if (tokenString == undefined) {
    throw new Response("Aun no se ha logueado", { status: 401 });
  }

  // Decodificar token
  const tokenDecodificado = jwtDecode<Token>(tokenString);
  if (Date.now() >= tokenDecodificado.exp * 1000) {
    throw new Response("Token Expiro", { status: 401 });
  }

  return { tipo: tokenDecodificado.aud };
};

// Componente por defecto
export default function Usuario() {
  // Extraer datos
  const { tipo } = useLoaderData() as { tipo: number };
  const [colapse, actualizar_colapse] = useState(false);

  // Renderizar segun tipo de usuario
  function SeleccionarTipoUsuario(t: number) {
    switch (t) {
      case Persona.Cliente_tipo:
        return <Cliente />;

      case Persona.Florista_tipo:
        return <Florista />;

      default:
        throw new Response("Error al autenticar", { status: 500 });
    }
  }

  // Cerrar sesion
  function CerrarSesionFunc() {
    // Remover token de cookie
    Cookies.remove(COOKIE_TOKEN);

    // Alerta de cierre de sesion
    alert("Sesion cerrada con exito");
  }

  // Menu
  function MostrarMenu() {
    if (colapse) {
      return (
        <nav className="d-lg-block sidebar bg-white">
          <div className="position-sticky">
            <div className="list-group list-group-flush mx-3 mt-4">
              <Link
                to={""}
                className="list-group-item list-group-item-action py-2 ripple"
                aria-current="true"
              >
                <i className="fas fa-tachometer-alt fa-fw me-3"></i>
                <span>Principal</span>
              </Link>
              <Link
                to={"productos"}
                // active
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-chart-area fa-fw me-3"></i>
                <span>Productos</span>
              </Link>
              <Link
                to={"beneficios"}
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-chart-area fa-fw me-3"></i>
                <span>Beneficios</span>
              </Link>
              {tipo == Persona.Cliente_tipo ? (
                <Link
                  to={"carrito"}
                  className="list-group-item list-group-item-action py-2 ripple"
                >
                  <i className="fas fa-chart-area fa-fw me-3"></i>
                  <span>Carrito</span>
                </Link>
              ) : null}
              {tipo == Persona.Florista_tipo ? (
                <>
                  <Link
                    to={"pedidos/pendientes"}
                    className="list-group-item list-group-item-action py-2 ripple"
                  >
                    <i className="fas fa-chart-area fa-fw me-3"></i>
                    <span>Pedidos pendientes</span>
                  </Link>
                  <Link
                    to={"registros"}
                    className="list-group-item list-group-item-action py-2 ripple"
                  >
                    <i className="fas fa-chart-area fa-fw me-3"></i>
                    <span>Registros</span>
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </nav>
      );
    }

    return (
      <nav className="collapse d-lg-block sidebar collapse bg-white">
        <div className="position-sticky">
          <div className="list-group list-group-flush mx-3 mt-4">
            <Link
              to={""}
              className="list-group-item list-group-item-action py-2 ripple"
              aria-current="true"
            >
              <i className="fas fa-tachometer-alt fa-fw me-3"></i>
              <span>Principal</span>
            </Link>
            <Link
              to={"productos"}
              // active
              className="list-group-item list-group-item-action py-2 ripple"
            >
              <i className="fas fa-chart-area fa-fw me-3"></i>
              <span>Productos</span>
            </Link>
            <Link
              to={"beneficios"}
              className="list-group-item list-group-item-action py-2 ripple"
            >
              <i className="fas fa-chart-area fa-fw me-3"></i>
              <span>Beneficios</span>
            </Link>
            {tipo == Persona.Cliente_tipo ? (
              <Link
                to={"carrito"}
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-chart-area fa-fw me-3"></i>
                <span>Carrito</span>
              </Link>
            ) : null}
            {tipo == Persona.Florista_tipo ? (
              <>
                <Link
                  to={"pedidos/pendientes"}
                  className="list-group-item list-group-item-action py-2 ripple"
                >
                  <i className="fas fa-chart-area fa-fw me-3"></i>
                  <span>Pedidos pendientes</span>
                </Link>
                <Link
                  to={"registros"}
                  className="list-group-item list-group-item-action py-2 ripple"
                >
                  <i className="fas fa-chart-area fa-fw me-3"></i>
                  <span>Registros</span>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <header>
        {MostrarMenu()}
        <nav
          id="main-navbar"
          className="navbar navbar-expand-lg navbar-light bg-white fixed-top"
        >
          <div className="container-fluid">
            <button
              onClick={() => {
                {
                  if (colapse == true) {
                    actualizar_colapse(false);
                  } else {
                    actualizar_colapse(true);
                  }
                }
              }}
              data-mdb-button-init
              className="navbar-toggler"
              type="button"
              data-mdb-collapse-init
              data-mdb-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="fas fa-bars"></i>
            </button>

            <Link className="navbar-brand" to={""}>
              <img
                src="https://scontent.ftru2-3.fna.fbcdn.net/v/t39.30808-6/272744481_1307952329722308_6162683603750679793_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGGUOeIauHd8gA_LcOgBbzJwgvYFv4KZcjCC9gW_gplyFAL6QzgGLnf-eVqIVsCdLdqORq8WwINFgu7LUBeqOI_&_nc_ohc=DuyFbQpzJv0Q7kNvgFXMKfS&_nc_ht=scontent.ftru2-3.fna&oh=00_AYBXdJSbD9uvasrBeRGWRFsmX1BAR53kQlzEYqEpIMZ4Yw&oe=66CE2FF5"
                height="45"
                width="auto"
                alt="MDB Logo"
                loading="lazy"
                style={{ borderRadius: ".5rem" }}
              />
            </Link>

            <ul className="navbar-nav ms-auto d-flex flex-row">
              {/* <Link to={"/"}>
                <button className="btn btn-primary" onClick={CerrarSesionFunc}>
                  Cerrar sesion
                </button>
              </Link> */}
              <Link
                to={"/"}
                className="nav-item me-3 me-lg-0"
                onClick={CerrarSesionFunc}
              >
                <a className="nav-link" href="#">
                  <i className="fas fa-user-xmark"></i>
                </a>
              </Link>
            </ul>
          </div>
        </nav>
      </header>

      <main className="position-relative w-100">
        <div className="container pt-4">{SeleccionarTipoUsuario(tipo)}</div>
      </main>
    </>
  );
}
