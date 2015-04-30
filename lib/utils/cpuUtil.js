var cpu = require("../cpu.js");

// Cpu usage
var load = {};

// The module to be exported.
var cpuUtil = module.exports;

cpuUtil.startCpuSequence = function () {
  cpu.start(function (l) {
    load = l;
  });
};

cpuUtil.getCpuLoad = function () {
  return load;
};