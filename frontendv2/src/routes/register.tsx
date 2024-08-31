import { ActionFunction, Form, Link, redirect } from "react-router-dom";
import { Persona } from "../data/persona";
import { RegistrarPersona } from "../models/persona";
import { IResponse } from "../interfaces/http";

// Accion para formulario
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const dataBody = data as any as RegistrarPersona;
  // Datos nulos
  if (
    dataBody.Nombres == "" ||
    dataBody.Apellidos == "" ||
    dataBody.Correo == "" ||
    dataBody.Contraseña == "" ||
    dataBody.Contraseña.length < 8
  ) {
    alert("Ingreso de datos invalido");
    return null;
  }

  // Contraseña diferentes
  if (data.Contraseña != data.Confirmacion_Contraseña) {
    alert("Contraseñas no coinciden");
    return null;
  }

  // Fetch
  const res = await fetch("http://localhost:3000/persona/register", {
    method: "POST",
    body: JSON.stringify({
      Nombres: data.Nombres,
      Apellidos: data.Apellidos,
      Correo: data.Correo,
      Contraseña: data.Contraseña,
      TipoPersona: Persona.Cliente_tipo,
    }),
  }).catch((e) => {
    throw new Response(e, { status: 500 });
  });

  // Extraer response
  const body = (await res.json()) as any as IResponse;

  // Error del servidor
  if (body.Error != "") {
    alert("Error de registro");
    return null;
  }

  console.log(body);

  // Si hay errores
  if (!res.ok) {
    throw new Response((res.body as any).Error, {
      status: res.status,
    });
  }

  // Redirigir a la url: "/usuario/:id"
  alert("Registro exitoso");
  return null;
  return redirect(`/`);
};

export default function Register() {
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
                        Ingresa tus datos
                      </h5>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="Nombres"
                        />
                        <label className="form-label">Nombres</label>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="Apellidos"
                        />
                        <label className="form-label">Apellidos</label>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          name="Correo"
                        />
                        <label className="form-label">Correo</label>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          name="Contraseña"
                        />
                        <label className="form-label">Contraseña</label>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          name="Confirmacion_Contraseña"
                        />
                        <label className="form-label">
                          Confirmar Contraseña
                        </label>
                      </div>

                      <div className="pt-1 mb-4">
                        <button
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                        >
                          Registrar
                        </button>
                      </div>

                      <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                        Ya estas registrado?{" "}
                        <Link to={"/login"} style={{ color: "#393f81" }}>
                          Ingresa aca
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
