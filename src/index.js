const express = require("express");
const cors = require("cors");
const movies = require("../web/src/data/movies.json");
const users = require("../web/src/data/users.json");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// Get, obtener datos de la explicación
server.get("/movies", (req, res) => {
  console.log("Petición a la ruta GET /movies");
  const response = {
    success: true,
    movies: movies,
  };
  res.json(response);
});

server.get("/users", (req, res) => {
  console.log("Petición a la ruta GET /movies");
  const response = {
    success: true,
    movies: movies,
  };
  res.json(response);
});

//escribimos la ruta con ./src porque node busca la carpeta de estáticos desde la raiz del proyecto
const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

const staticServerImagesPath = "./src/public-movies-images";
server.use(express.static(staticServerImagesPath));
