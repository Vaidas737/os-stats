var util = require("../util.js");

// WebSocket frequency in milliseconds.
var freq = 1000;

// The module to be exported.
var wsController = module.exports;

wsController.connection = function (ws) {

  // start interval
  var id = setInterval(function () {
    util.getOsStats(function (data) {
      ws.send(JSON.stringify(data), function() { /* ignore errors */ });
    });
  }, freq);

  console.log("websocket connection start");

  // on connection close
  ws.on("close", function () {
    console.log("websocket connection close");
    clearInterval(id);
  });
};
