// import * as middlewares from './middlewares'

module.exports = [
  {
    path: "/test",
    method: "POST",
    type: "public",
  },
  {
    path: "/test",
    method: "GET",
    type: "public",
  },
  {
    path: "/",
    method: "GET",
    type: "public",
  },
  {
    path: "/greeting",
    alias: "hello",
    method: "GET",
    type: "public",
  },
];
