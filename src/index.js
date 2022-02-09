const express = require("express");
const cors = require("cors");
const movies = require("../web/src/data/movies.json");
const users = require("../web/src/data/users.json");
const Database = require("better-sqlite3");
const db = new Database("./src/db/database.db", { verbose: console.log });

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// Get, obtener datos de la explicación
server.get("/movies", (req, res) => {
  console.log("Petición a la ruta GET /movies");
  const query = db.prepare("SELECT * FROM movies");
  const movies = query.all();
  res.json({
    success: true,
    movies: movies,
  });
});

server.post("/login", (req, res) => {
  console.log("Petición a la ruta POST /login");
  const query = db.prepare(
    "SELECT * FROM users WHERE email = ? and password = ?"
    //usar id en lugar de * ? (revisar bases de datos I, 6. Crear la tabla de usuarias)
  );
  const user = query.get(req.body.email, req.body.password);
  if (user !== undefined) {
    res.json({
      success: true,
      userId: "id_de_la_usuaria_encontrada",
      //devolver el id
    });
  } else {
    res.json({
      success: false,
      errorMessage: "Usuaria/o no encontrada/o",
    });
  }
});

// A revisar!
// server.post("/users", (req, res) => {
//   console.log("req.body");
//   const reponseUsers = users.find(users => users.id === requestParamsId);
//   };
//   res.json(response);
// });

// Get, obtener datos de la explicación
server.get("/movie/:movieId", (req, res) => {
  const query = db.prepare("SELECT * FROM movies WHERE id = ?");
  const foundMovie = query.get(req.params.movieId);
  res.render("movie", foundMovie);
});

// POST, registro de nuevas usuarias en el back
server.post("/signup", (req, res) => {
  // const query = db.prepare("SELECT * FROM users WHERE email = ?");
  // const result = query.run(req.body.email);
  // res.json(result);
  const query = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
  const result = query.run(req.body.email, req.body.password);
  console.log(result);
  res.json({
    success: true,
    userId: result.lastInsertRowid,
  });
});

// Get obtener usuario y película
server.get("/user/movies", (req, res) => {
  const query = db.prepare("SELECT * FROM rel_movies_users WHERE id = ?");
  const result = query.get(req.header("user-id"));
  res.json({
    success: true,
    movies: [],
  });
});

//escribimos la ruta con ./src porque node busca la carpeta de estáticos desde la raiz del proyecto
const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

const staticServerImagesPath = "./src/public-movies-images";
server.use(express.static(staticServerImagesPath));

const staticServerStylesPath = "./src/styles";
server.use(express.static(staticServerStylesPath));
