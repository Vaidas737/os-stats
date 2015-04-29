var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");

var util = require("./lib/util.js");
var wsController = require("./lib/controllers/websocketController.js");

var app = express();
var port = 8080;

// start cpu stats calculation
util.startCpuSequence();

// set public directory
app.use(express.static(__dirname + "/public"));

// create server
var server = http.createServer(app);
server.listen(port);
console.log("http server listening on " + port);

// create websocket server
var wss = new WebSocketServer({ server: server });

// register websocket controller
wss.on("connection", wsController.connection);
