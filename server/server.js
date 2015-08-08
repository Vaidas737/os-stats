var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var _ = require("underscore");

var wsController = require("./websocketController.js");
var osUsage = require("../lib/osUsage.js");

var app = express();
var port = 8080;
var freq = 1000;

// set public directory
app.use(express.static(__dirname + "/../public"));

// create server
var server = http.createServer(app);
server.listen(port);
console.log("http server listening on " + port);

// create websocket server
var wss = new WebSocketServer({ server: server });
wss.on("connection", _.bind(wsController.connection, wsController, osUsage.start(freq), freq));
console.log("websocket listening on " + port);