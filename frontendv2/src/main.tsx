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
import Pedido_Detalle, {
  loader as pedido_detalleLoader,
  action as PedidosAction,
} from "./routes/pedidos_detalle";
import Producto_Crear, {
  action as productoAction,
  loader as productocrearLoader,
} from "./routes/producto_crear";
import Beneficio_Crear, {
  action as BeneficioCrearAction,
} from "./routes/beneficio_crear";
import Registros, { action as RegistrosAction } from "./routes/registros";

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
        element: [<AuthMiddleware />, <Info />],
        loader: infoloader,
      },
      {
        path: "productos",
        element: [<AuthMiddleware />, <Productos />],
        loader: usuarioproductosloader,
      },
      {
        path: "productos/crear",
        element: [<AuthMiddleware />, <Producto_Crear />],
        loader: productocrearLoader,
        action: productoAction,
      },
      {
        path: "beneficios",
        element: [<AuthMiddleware />, <Beneficios />],
        loader: beneficiosloader,
      },
      {
        path: "beneficios/crear",
        element: [<AuthMiddleware />, <Beneficio_Crear />],
        action: BeneficioCrearAction,
      },
      {
        path: "carrito",
        element: [<AuthMiddleware />, <Carrito />],
        loader: carritoloader,
        action: carritoAction,
      },
      {
        path: "pago",
        element: [<AuthMiddleware />, <Pago />],
        loader: pagoloader,
      },
      {
        path: "pedidos/:idpedido",
        element: [<AuthMiddleware />, <Pedido />],
        loader: PedidoLoader,
      },
      {
        path: "pedidos/pendientes",
        element: [<AuthMiddleware />, <Pedidos />],
        loader: PedidosLoader,
      },
      {
        path: "pedidos/pendientes/:idpedido",
        element: [<AuthMiddleware />, <Pedido_Detalle />],
        loader: pedido_detalleLoader,
        action: PedidosAction,
      },
      {
        path: "registros",
        element: [<AuthMiddleware />, <Registros />],
        action: RegistrosAction,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
