import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { COOKIE_TOKEN } from "../data/token";
import { Token } from "../interfaces/token";
import { HOST } from "../data/http";
import { IResponse } from "../interfaces/http";

export default function AuthMiddleware() {
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

  (async () => {
    // Actualizar token
    const res = await fetch(
      HOST + "/persona/" + tokenDecodificado.sub.Id + "/refresh",
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + Cookies.get(COOKIE_TOKEN),
        },
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        throw new Response(e);
      });

    const body = res as any as IResponse;
    if (body.Error != "") {
      throw new Response(body.Error);
    }

    // Agregar nueva cookie
    Cookies.set(COOKIE_TOKEN, body.Data);
  })();

  return null;
}
