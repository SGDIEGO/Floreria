import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";

interface IappCtx {
  notificacionesElement: JSX.Element | null;
  actualizar_notificacionesElement: React.Dispatch<
    React.SetStateAction<JSX.Element | null>
  >;
}

const appCtx = createContext<IappCtx>(null!);

function appCtxProvider() {
  // Notificaciones
  const [notificacionesElement, actualizar_notificacionesElement] =
    useState<JSX.Element | null>(null);

  // Valores del context
  const value: IappCtx = {
    notificacionesElement: notificacionesElement,
    actualizar_notificacionesElement: actualizar_notificacionesElement,
  };

  return <appCtx.Provider value={value}>{<Outlet/>}</appCtx.Provider>;
}

export { appCtxProvider };
