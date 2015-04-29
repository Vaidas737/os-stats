/**
 * Module cpu.
 * This module calculates current cpu usage.
 *
 * NOTE:
 * This model tested on Ubuntu 14.04 (Linux), may not work on Windows or OSX machines.
 */

var os = require("os");

// Interval of current running cpu sequence
var interval = null;

// The module to be exported.
var cpu = module.exports;

/**
 *  Start cpu sequence
 *  options: [ frequency, ] callback
 *  defaults: frequency = 1000ms
 */
cpu.start = function (freq, cb) {

  // don't run again if already running
  if (interval !== null) { return; }

  if(typeof freq == "function") {
    cb = freq;
    freq = 1000;
  }

  var prevInfo = getInfo();

  interval = setInterval(function () {
    var info = getInfo();
    var perc = calcPerc(info.idle, info.total, prevInfo.idle, prevInfo.total);
    prevInfo = info;
    cb(perc);
  }, freq);
};

/**
 * Stop running cpu sequence
 */
cpu.stop = function () {
  if (interval !== null) {
    clearInterval(interval);
    interval = null;
  }
};

function getInfo() {

  var cpus = os.cpus();

  var total = 0;
  var idle = 0;

  for (var core in cpus) {
    var times = cpus[core].times;
    idle += times.idle;
    total += times.user + times.nice + times.sys + times.idle + times.irq;
  }

  return { idle: idle, total: total };
}

function calcPerc(idle, total, prevIdle, prevTotal) {
  return (( total - prevTotal ) - ( idle - prevIdle )) / ( total - prevTotal );
}
