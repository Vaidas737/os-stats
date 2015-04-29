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
 *  Start cpu sequence.
 *  The callback is passed one arguments (result),
 *  where result is an object of total and per core usage in percentage.
 *  The callback will be called in frequency that was provided in argument (frequency).
 *  As frequency is optional the defaults is 1000ms.
 *
 *  options: [ frequency, ] callback
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
    var cores = [];

    var total = calcPerc(info.idle, info.total, prevInfo.idle, prevInfo.total);

    for (var core in info.cores) {
      var coreInfo = info.cores[core];
      var prevCoreInfo = prevInfo.cores[core];
      cores.push(calcPerc(coreInfo.idle, coreInfo.total, prevCoreInfo.idle, prevCoreInfo.total));
    }

    prevInfo = info;
    cb({ total: total, cores: cores });
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

  var cores = [];
  var total = 0;
  var idle = 0;

  for (var core in cpus) {
    var times = cpus[core].times;
    var i = times.idle;
    var t = times.user + times.nice + times.sys + times.idle + times.irq;

    idle += i;
    total += t;
    cores.push({ idle: i, total: t });
  }

  return { idle: idle, total: total , cores: cores};
}

function calcPerc(idle, total, prevIdle, prevTotal) {
  return (( total - prevTotal ) - ( idle - prevIdle )) / ( total - prevTotal );
}
