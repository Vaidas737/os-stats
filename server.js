var WebSocketServer = require('ws').Server;
var http = require('http');
var express = require('express');

var cpu = require("./lib/cpu.js");
var mem = require("./lib/mem.js");

var app = express();
var port = 8080;
var freq = 1000; // interval frequency in milliseconds
var load = 0;

// start cpu stats calculation
cpu.start(function (l) {
  load = l;
});
console.log("start calculating cpu usage");

// set public directory
app.use(express.static(__dirname + '/public'));

// create server with port
var server = http.createServer(app);
server.listen(port);
console.log('http server listening on ' + port);

// create websocket server
var wss = new WebSocketServer({server: server});
console.log('websocket server created');

// register websocket controller
wss.on('connection', wsConnection);

//////////////////////
//    Controllers   //
//////////////////////

// websocket connection controller
function wsConnection(ws) {
  console.log('websocket connection open');

  // send data the first time
  sendData(ws);

  // start interval
  var id = setInterval(function() {
    sendData(ws);
  }, freq);

  // on connection close
  ws.on('close', function(code, message) {
    console.log('websocket connection close');
    clearInterval(id);
  });
}

////////////////////
//      Utils     //
////////////////////

// return cpus and memory status
function getOsStatus(cb) {
  mem.used(function (err, used) {
    cb({ 'cpu': load, 'mem': used });
  });
}

// send data through websocket
function sendData(ws) {
  getOsStatus(function (data) {
    ws.send(JSON.stringify(data), function() { /* ignore errors */ });
  });
}
