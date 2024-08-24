import { useState } from "react";
import { NotificacionTipo } from "../data/notificacion";

export default function Notificacion({
  tipo,
  mensaje,
  actualizar_tipoNotificacion,
  actualizar_responseNotificacion,
}: {
  tipo: number;
  mensaje: string;
  actualizar_tipoNotificacion: React.Dispatch<React.SetStateAction<number>>;
  actualizar_responseNotificacion: React.Dispatch<
    React.SetStateAction<boolean>
  > | null;
}) {
  switch (tipo) {
    case NotificacionTipo.Question:
      return (
        <div
          className="alert alert-success alert-dismissible fade show position-absolute top-50 start-50 translate-middle mt-5"
          role="alert"
        >
          {mensaje}
          <div className="d-flex justify-content-evenly">
            <i
              className="far fa-handshake"
              onClick={() => {
                if (actualizar_responseNotificacion != null) {
                  actualizar_responseNotificacion(true);
                }
              }}
            ></i>
            <i
              className="far fa-thumbs-down"
              onClick={() => {
                if (actualizar_responseNotificacion != null) {
                  actualizar_responseNotificacion(false);
                }
              }}
            ></i>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => {
              actualizar_tipoNotificacion(-1);
            }}
          ></button>
        </div>
      );
    case NotificacionTipo.Sucessfull:
      return (
        <div
          className="alert alert-success alert-dismissible fade show position-absolute top-0 end-0 mt-5"
          role="alert"
        >
          <strong>Sucessfull</strong> {mensaje}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => {
              actualizar_tipoNotificacion(-1);
            }}
          ></button>
        </div>
      );
    case NotificacionTipo.Error:
      return (
        <div
          className="alert alert-danger alert-dismissible fade show position-absolute top-0 end-0 mt-5"
          role="alert"
        >
          <strong>Danger</strong> {mensaje}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => {
              actualizar_tipoNotificacion(-1);
            }}
          ></button>
        </div>
      );

    case NotificacionTipo.Warning:
      return (
        <div
          className="alert alert-warning alert-dismissible fade show position-absolute top-0 end-0 mt-5"
          role="alert"
        >
          <strong>Warning</strong> {mensaje}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => {
              actualizar_tipoNotificacion(-1);
            }}
          ></button>
        </div>
      );
    default:
      return null;
  }
}
