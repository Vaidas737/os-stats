var WebSocketServer = require("ws").Server;
var express = require("express");

var wsController = require("./controllers/websocketController.js");
var osUsage = require("./libs/osUsage.js");

var app = express();

app.use(express.static(__dirname + "/../public"));

var websocket = function(server, freq) {
  var wss = new WebSocketServer({ server: server });
  wss.on("connection", wsController.connection.bind(wsController, osUsage.start(freq), freq));
  return wss;
};

module.exports = {
  app: app,
  websocket: websocket
};
