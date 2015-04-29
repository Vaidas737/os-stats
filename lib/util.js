var cpu = require("./cpu.js");
var mem = require("./mem.js");

// Cpu usage
var load = {};

// The module to be exported.
var util = module.exports;

util.startCpuSequence = function () {
  cpu.start(function (l) {
    load = l;
  });
};

util.getOsStats = function (cb) {
  mem.used(function (err, used) {
    cb({ 'cpu': load, 'mem': used });
  });
};