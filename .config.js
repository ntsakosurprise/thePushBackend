const routes = require("./includes/routes");
const tasks = require("./includes/tasks");
// const templates = require("./includes/templates");
const middlewares = require("./includes/globals");

module.exports = {
  domain: [{ name: "passport", set: "initialize" }],
  middleware: {
    ppublic: {
      addMiddleware: middlewares.ppublic,
    },
    pprivate: {
      addMiddleware: middlewares.pprivate,
    },
    all: {
      addMiddleware: middlewares.all,
    },
  },

  router: routes,
  kronjo: tasks,
  //   mailty: templates,
  //   mailer: "",
  //   register: "",
  // logger: {level: 'info',trans:['file',{path: 'http://www.iiprodakts/logger'}]},
  cluster: { workers: 3, spawn: true },
  server: "server",
};
