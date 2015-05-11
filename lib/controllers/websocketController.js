var cpuUtil = require("../utils/cpuUtil.js");
var mem = require("../models/mem.js");

// WebSocket frequency in milliseconds.
var freq = 1000;

module.exports = {
  connection: function(ws) {

    // start interval
    var id = setInterval(function() {
      mem.used(function(used) {
        var osUsage = {
          'cpu': cpuUtil.getCpuLoad().total,
          'mem': used
        };
        ws.send(JSON.stringify(osUsage), function() { /* ignore errors */ });
      });
    }, freq);

    console.log("websocket connection start");

    // on connection close
    ws.on("close", function() {
      console.log("websocket connection close");
      clearInterval(id);
    });
  }
};