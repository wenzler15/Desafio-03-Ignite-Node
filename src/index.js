const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

let repositories = [];

function checkExistsRepository(request, response, next) {
  const { id } = request.params;

  const rep = repositories.find((rep) => rep.id === id);

  if (!rep)
    return response.status(404).json({ error: "Repository not found!" });

  request.rep = rep;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkExistsRepository, (request, response) => {
  const { rep } = request;
  const { title, techs, url } = request.body;

  rep.title = title;
  rep.techs = techs;
  rep.url = url;

  return response.json(rep);
});

app.delete("/repositories/:id", checkExistsRepository, (request, response) => {
  const { rep } = request;

  repositories = repositories.filter((item) => item.id !== rep.id);

  return response.status(204).send();
});

app.post(
  "/repositories/:id/like",
  checkExistsRepository,
  (request, response) => {
    const { rep } = request;

    rep.likes++;

    return response.json({ likes: rep.likes });
  }
);

module.exports = app;
