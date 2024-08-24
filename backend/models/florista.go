package models

type Florista struct {
	Id_persona    int
	Id_trabajador int
}

type Trabajador struct {
	Id         int
	Asignacion string
	Sueldo     float32
}
