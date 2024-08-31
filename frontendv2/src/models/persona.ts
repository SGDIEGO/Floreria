interface ClienteDto {
  Id: number;
  Dni: number;
  Nombres: string;
  Apellidos: string;
  Correo: string;
  Contraseña: string;
  Direccion: string;
  Telefono: string;
  Puntos: number;
}

interface FloristaDto {
  Id: number;
  Dni: number;
  Nombres: string;
  Apellidos: string;
  Correo: string;
  Contraseña: string;
  Direccion: string;
  Telefono: string;
}

interface RegistrarPersona {
  Nombres: string;
  Apellidos: string;
  Dni: string;
  Direccion: string;
  Telefono: string;
  Correo: string;
  Contraseña: string;
  TipoPersona: number;
}

interface ActualizarPersona {
  Nombres: string;
  Apellidos: string;
  Correo: string;
  Telefono: string;
  Direccion: string;
}

interface RegistrarTrabajador {
  Nombres: string;
  Apellidos: string;
  Dni: string;
  Direccion: string;
  Telefono: string;
  Correo: string;
  Contraseña: string;
  Placa: string;
  TipoPersona: number;
}

export type {
  ClienteDto,
  FloristaDto,
  RegistrarPersona,
  ActualizarPersona,
  RegistrarTrabajador,
};
