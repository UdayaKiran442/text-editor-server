const routes = require("express").Router();

routes.use("/api/v1/document", require("./v1/document"));

module.exports = routes;
