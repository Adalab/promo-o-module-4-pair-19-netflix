const express = require("express");
const cors = require("cors");
const movies = require("../web/src/data/movies.json");
const users = require("../web/src/data/users.json");
const Database = require("better-sqlite3");
const db = new Database("./src/db/database.db", { verbose: console.log });
const dbusers = new Database("./src/db/dataBaseUsers.db", { verbose: console.log });

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
  const query = dbusers.prepare("SELECT * FROM users WHERE email = ?");
  const result = query.run(req.body.email);
  res.json(result);
  // const query = dbusers.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
  // const result = query.run(req.body.email, req.body.password);
  // console.log(result);
  // res.json({
  //   "success": true,
  //   "userId": result.lastInsertRowid
  // });
});

//escribimos la ruta con ./src porque node busca la carpeta de estáticos desde la raiz del proyecto
const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

const staticServerImagesPath = "./src/public-movies-images";
server.use(express.static(staticServerImagesPath));

const staticServerStylesPath = "./src/styles";
server.use(express.static(staticServerStylesPath));
