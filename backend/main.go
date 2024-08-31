package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/SGDIEGO/Floreria/routes"
	// _"github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "diegoasg04"
	dbname   = "Floreria"
)

func main() {
	// Servidor
	server := http.NewServeMux()

	// Cargar base de datos
	// config := mysql.Config{
	// 	User:   "root",
	// 	Passwd: "diegoasg04",
	// 	DBName: "floreria",
	// 	Addr:   "127.0.0.1:3306",
	// }
	db, err := sql.Open("postgres", fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname))

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
