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
export type { ClienteDto, FloristaDto };
