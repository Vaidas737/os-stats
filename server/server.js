var WebSocketServer = require("ws").Server;
var express = require("express");
var http = require("http");

var wsController = require("./websocketController.js");
var osUsage = require("../lib/osUsage.js");
var config = require("./config.js");

var app = express();

// set public directory
app.use(express.static(__dirname + "/../public"));

// create server
var server = http.createServer(app);
server.listen(config.port);
console.log("http server listening on " + config.port);

// create websocket server
var wss = new WebSocketServer({ server: server });
wss.on("connection", wsController.connection.bind(wsController, osUsage.start(config.freq), config.freq));
console.log("websocket listening on " + config.port);