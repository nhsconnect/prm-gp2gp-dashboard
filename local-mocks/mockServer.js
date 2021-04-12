const jsonServer = require("json-server");
const {
  organisations,
  practiceWithIntegrations,
  practicesWithSomeIntegrations,
} = require("./mocks");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.get("/organisations/A12345", (request, response) => {
  return response.send(practiceWithIntegrations);
});

server.get("/organisations/A12347", (request, response) => {
  return response.send(practicesWithSomeIntegrations);
});

server.get("/organisations", (request, response) => {
  if (request.query.TargetOrgId) {
    if (request.query.TargetOrgId === "10D") {
      return response.send(organisations);
    } else {
      return response.send({ Organisations: [] });
    }
  }
});

server.listen(port, () => {
  console.log("JSON Server is running");
});
