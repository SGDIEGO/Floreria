import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { COOKIE_TOKEN } from "../data/token";
import { Token } from "../interfaces/token";

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

  return null;
}
