const api = require("./api");

const constructorMethod = (app) => {
  app.use("/api", api);
  app.use("*", (req, res) => {
    res.json({ error: "Cannot find this route, please try again" });
  });
};

module.exports = constructorMethod;
