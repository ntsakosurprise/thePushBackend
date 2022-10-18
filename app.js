const anzii = require("anzii");
require("@babel/register");
require = require("esm")(module /*, options*/);
const plugins = require("./plugins");
// const Hello = require("anzii-hello-example");
anzii({ ...plugins });
