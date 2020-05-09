const express = require("express");

const server = express();
server.use(express.json());

// query params = ?teste=1
// route params = /users/1
// request body = {"name": "Jean", "email": "jeanborgse946@gmail.com"}

const users = ["Jean", "Carlos", "Borges"];

// Middleware Global -> intercepta globalmente todas as rotas da aplicação
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

// Middleware local -> passado como parametro para as rotas que devem usa-lo
function checkIfUserExist(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User's name is required" });
  }
  return next();
}

function checkForUserIndex(req, res, next) {
  const user = users[req.params.index];
  console.log(user);
  if (!user) {
    return res.status(400).json({ error: "Invalid Index" });
  }
  req.user = user;
  return next();
}

// Listagem usuarios
server.get("/users", (req, res) => {
  return res.json(users);
});

// Usuario unico
server.get("/users/:index", checkForUserIndex, (req, res) => {
  return res.json(req.user);
});

// Adição de usuarios
server.post("/users", checkIfUserExist, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});

// Edição de usuarios
server.put("/users/:index", checkForUserIndex, checkIfUserExist, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;
  return res.json(users);
});

// Exclusão de usuarios
server.delete("/users/:index", (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);
  return res.json(users);
});

server.listen(3000);
