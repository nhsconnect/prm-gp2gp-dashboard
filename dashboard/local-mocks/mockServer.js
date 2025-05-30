const jsonServer = require("json-server");
const {
  practiceWithIntegrations,
  practiceWithSomeIntegrations,
  practiceWithAnIntegration,
} = require("./mocks");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.get("/ORD/2-0-0/organisations/A12345", (request, response) => {
  return response.send(practiceWithIntegrations);
});

server.get("/ORD/2-0-0/organisations/A12347", (request, response) => {
  return response.send(practiceWithSomeIntegrations);
});

server.get("/ORD/2-0-0/organisations/Z12347", (request, response) => {
  return response.send(practiceWithAnIntegration);
});

server.listen(port, () => {
  console.log(`JSON Server is running on port: http://localhost:${port}`);
});
