const path = require("path");

module.exports = {
  entry: "./app.js",
  target: "node",
  output: {
    path: path.join(__dirname),
    filename: "index.js",
    chunkFilename: "[id].js",
    publicPath: "",
  },
  devtool: "source-map",
};
