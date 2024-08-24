import { ActionFunction, Link, redirect } from "react-router-dom";
import { Form } from "react-router-dom";
import { IResponse } from "../interfaces/http";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Token } from "../interfaces/token";
import { COOKIE_TOKEN } from "../data/token";

// Accion para formulario
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log("data: ", data);

  // Fetch
  const res = await fetch("http://localhost:3000/persona/login", {
    method: "POST",
    body: JSON.stringify(data),
  }).catch((e) => {
    throw new Response(e, { status: 500 });
  });

  // Si hay errores
  if (!res.ok) {
    console.log("e: ", res);
    throw new Response((res.body as any).Error, {
      status: res.status,
    });
  }

  // Extraer body
  const dataBody = (await res.json()) as any as IResponse;

  // Extraer token
  let tokenString = dataBody.Data;
  Cookies.set(COOKIE_TOKEN, tokenString);
  let tokenDecodificado = jwtDecode<Token>(tokenString);

  // Redirigir a la url: "/usuario/:id"
  return redirect(`/usuario/${tokenDecodificado.sub.Id}`);
};

// Componente por default
export default function Login() {
  return (
    <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVN4VKPmxNXtQZN4VxQq6dFqf_wEHvO7DPvQ&s"
                    alt="login form"
                    className="img-fluid"
                    style={{
                      borderRadius: "1rem 0 0 1rem",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <Form method="post">
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <img
                          style={{ width: "5rem", borderRadius: ".8rem" }}
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCmf8c8tn8BuhghqTY9GKDXwbH0jpUHVbV_Q&s"
                          alt=""
                        />
                        <span className="h1 fw-bold mb-0">Pretty Love</span>
                      </div>

                      <h5
                        className="fw-normal mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Ingresa a tu cuenta
                      </h5>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="email"
                          id="form2Example17"
                          className="form-control form-control-lg"
                          name="Correo"
                        />
                        <label className="form-label">Correo</label>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="password"
                          id="form2Example27"
                          className="form-control form-control-lg"
                          name="Contraseña"
                        />
                        <label className="form-label">Contraseña</label>
                      </div>

                      <div className="pt-1 mb-4">
                        <button
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                        >
                          Login
                        </button>
                      </div>

                      <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                        No tienes una cuenta?{" "}
                        <Link to={"/register"} style={{ color: "#393f81" }}>
                          Registrate aca
                        </Link>
                      </p>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
