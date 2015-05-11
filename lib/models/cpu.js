var os = require("os");

// Interval of the currently running cpu sequence
var interval = null;

function getInfo() {

  var cpus = os.cpus();

  var cores = [];
  var total = 0;
  var idle = 0;

  for (var c in cpus) {
    var times = cpus[c].times;
    var i = times.idle;
    var t = times.user + times.nice + times.sys + times.idle + times.irq;

    idle += i;
    total += t;
    cores.push({ idle: i, total: t });
  }

  return { idle: idle, total: total , cores: cores };
}

function calc(idle, total, prevIdle, prevTotal) {
  return (( total - prevTotal ) - ( idle - prevIdle )) / ( total - prevTotal );
}

/**
 * This module calculates current cpu usage.
 */
var Cpu = {

  /**
   *  Start cpu sequence.
   *  The callback is passed one argument (result),
   *  where result is an object of total and per core usage in percentage.
   *  The callback will be called in frequency that was provided in argument (frequency).
   *  As frequency is optional the defaults is 1000ms.
   *
   *  options: [ frequency, ] callback
   */
  start: function(freq, cb) {
    // don't run again if already running
    if (interval !== null) { return; }

    if (typeof freq == "function") {
      cb = freq;
      freq = 1000;
    }

    var prevInfo = getInfo();

    interval = setInterval(function() {
      var info = getInfo();
      var cores = [];

      var total = calc(info.idle, info.total, prevInfo.idle, prevInfo.total) * 100;

      for (var c in info.cores) {
        var coreInfo = info.cores[c];
        var prevCoreInfo = prevInfo.cores[c];
        cores.push(calc(coreInfo.idle, coreInfo.total, prevCoreInfo.idle, prevCoreInfo.total) * 100);
      }

      prevInfo = info;
      cb({ total: total, cores: cores });
    }, freq);
  },

  /**
   *  Stop cpu sequence.
   */
  stop: function() {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  }
};

module.exports = Cpu;