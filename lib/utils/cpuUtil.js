var cpu = require("../models/cpu.js");

// Cpu usage
var load = {};

module.exports = {
  startCpuSequence: function() {
    cpu.start(function(l) {
      load = l;
    });
  },
  getCpuLoad: function() {
    return load;
  }
};