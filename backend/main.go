package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/SGDIEGO/Floreria/routes"
	"github.com/go-sql-driver/mysql"
	"github.com/rs/cors"
)

func main() {
	// Servidor
	server := http.NewServeMux()

	// Cargar base de datos
	config := mysql.Config{
		User:   "root",
		Passwd: "diegoasg04",
		DBName: "floreria",
		Addr:   "127.0.0.1:3306",
	}
	db, err := sql.Open("mysql", config.FormatDSN())

	if err != nil {
		log.Fatal(err.Error())
	}

	err = db.Ping()
	if err != nil {
		log.Fatal(err.Error())
	}

	// Iniciar ruteo
	routes.InitRoutes(server, db)

	// Listener
	log.Println("Listenning server in localhost:3000")
	// Cors
	http.ListenAndServe(":3000", cors.AllowAll().Handler(server))
}
