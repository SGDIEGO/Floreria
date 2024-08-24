import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  Route,
  Router,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import Login, { action as loginAction } from "./routes/login";
import Register, { action as registerAction } from "./routes/register";
import Usuario, { loader as usuarioloader } from "./routes/usuario";
import Productos, {
  loader as usuarioproductosloader,
} from "./routes/productos";
import Beneficios, { loader as beneficiosloader } from "./routes/beneficios";
import Home, { loader as homeloader } from "./routes/home";
import Carrito, {
  loader as carritoloader,
  action as carritoAction,
} from "./routes/carrito";
import AuthMiddleware from "./middlewares/authmiddleware";
import Info, { loader as infoloader } from "./routes/info";
import { appCtxProvider } from "./contexts/appContext";
import Pago, { loader as pagoloader } from "./routes/pago";
import Pedido, { loader as PedidoLoader } from "./routes/pedido";
import Pedidos, { loader as PedidosLoader } from "./routes/pedidos";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
        loader: homeloader,
      },
      {
        path: "login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "register",
        element: <Register />,
        action: registerAction,
      },
    ],
  },
  {
    path: "usuario/:id",
    loader: usuarioloader,
    element: [<AuthMiddleware />, <Usuario />],
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        index: true,
        element: <Info />,
        loader: infoloader,
      },
      {
        path: "productos",
        element: <Productos />,
        loader: usuarioproductosloader,
      },
      { path: "beneficios", element: <Beneficios />, loader: beneficiosloader },
      {
        path: "carrito",
        element: <Carrito />,
        loader: carritoloader,
        action: carritoAction,
      },
      {
        path: "pago",
        element: <Pago />,
        loader: pagoloader,
      },
      {
        path: "pedidos/:idpedido",
        element: <Pedido />,
        loader: PedidoLoader,
      },
      {
        path: "pedidos/pendientes",
        element: <Pedidos />,
        loader: PedidosLoader,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
