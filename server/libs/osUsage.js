var mem = require("./mem.js");
var cpu = require("./cpu.js");

var OsUsage = {
  usage: {},
  start: function(freq) {
    cpu.start(freq, function(load) {
      mem.usage(function(err, res) {
        OsUsage.usage = {"cpu": load, "mem": res};
      });
    });
    return OsUsage;
  }
};

module.exports = OsUsage;