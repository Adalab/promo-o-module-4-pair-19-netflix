// Importamos dependencias, bases de datos etc.
const express = require("express");
const cors = require("cors");
const movies = require("../web/src/data/movies.json");
const users = require("../web/src/data/users.json");
const Database = require("better-sqlite3");

// Indicamos, de cara al servidor, cómo vamos a trabajar:
const server = express();
server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");

// Iniciamos el servidor express:
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// Configuramos la base de datos:
const db = new Database("./src/db/database.db", { verbose: console.log });

// Obtenemos la información de la tabla movies de la base de datos:
server.get("/movies", (req, res) => {
  console.log("Petición a la ruta GET /movies");
  const query = db.prepare("SELECT * FROM movies");
  const movies = query.all();
  res.json({
    success: true,
    movies: movies,
  });
});

// Para logearse, saber si la usuaria está registrada o no:
server.post("/login", (req, res) => {
  console.log("Petición a la ruta POST /login");
  const query = db.prepare(
    "SELECT * FROM users WHERE email = ? and password = ?"
  );
  const user = query.get(req.body.email, req.body.password);
  if (user !== undefined) {
    res.json({
      success: true,
      userId: user.id,
    });
  } else {
    res.json({
      success: false,
      errorMessage: "Usuaria/o no encontrada/o",
    });
  }
});

// Renderizamos el detalle de la película usando el motor de plantillas:
server.get("/movie/:movieId", (req, res) => {
  const query = db.prepare("SELECT * FROM movies WHERE id = ?");
  const foundMovie = query.get(req.params.movieId);
  res.render("movie", foundMovie);
});

// Resgistramos nuevas usuarias (comprobando si aún no lo están) y las añadimos a la base de datos:
server.post("/signup", (req, res) => {
  const query = db.prepare("SELECT * FROM users WHERE email = ?");
  const result = query.get(req.body.email);
  if (result !== undefined) {
    res.json({
      success: false,
      errorMessage: "Usuaria ya existente",
    });
  } else {
    const query = db.prepare(
      "INSERT INTO users (email, password) VALUES (?, ?)"
    );
    const result = query.run(req.body.email, req.body.password);
    console.log(result);
    res.json({
      success: true,
      userId: result.lastInsertRowid,
    });
  }
});

// Obtener de la base de datos la relación entre usuarias y películas:
server.get("/user/movies", (req, res) => {
  const query = db.prepare("SELECT * FROM rel_movies_users WHERE id = ?");
  const result = query.get(req.header("user-id"));
  res.json({
    success: true,
    movies: [],
  });
});

// Servidores de estáticos:
const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

const staticServerImagesPath = "./src/public-movies-images";
server.use(express.static(staticServerImagesPath));

const staticServerStylesPath = "./src/styles";
server.use(express.static(staticServerStylesPath));
