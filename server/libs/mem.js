var fs = require("fs");
var exec = require("child_process").exec;

function isFunction(obj) {
  return typeof obj == "function" || false;
}

function concatWmicCommands(commands) {
  var cm = "";
  for (var i in commands) {
    cm += commands[i] + ( i < commands.length-1 ? " && " : "" );
  }
  return cm;
}

/**
 *  Asynchronously calculate total memory usage on
 *  win32 platform.
 *
 *  options: callback
 */
function getUsageWin32(cb) {
  // TODO: throw error
  if (!isFunction(cb)) { return; }

  var wmicCommand = [
    "wmic os get TotalVisibleMemorySize",
    "wmic os get FreePhysicalMemory"
  ];

  function calcUsage(data) {
    return (data["TotalVisibleMemorySize"] - data["FreePhysicalMemory"]) / data["TotalVisibleMemorySize"];
  }

  exec(concatWmicCommands(wmicCommand), function(error, stdout, stderr) {
    if (error || stderr) { return cb(error || stderr); }

    var meminfo = stdout.split("\r\r\n");
    var data = {};
    var key = null;

    for (var i in meminfo) {
      var value = meminfo[i].trim();
      if (!isNaN(value) && +value > 0) {
        data[key] = +value;
      } else if (value.length > 0) {
        key = value;
      }
    }

    cb(null, calcUsage(data) * 100);
  });
}

/**
 * Asynchronously calculate total memory usage on
 * linux platform.
 *
 * options: callback
 */
function getUsageLinux(cb) {
  // TODO: throw error
  if (!isFunction(cb)) { return; }

  function calcFree(data) {
    return (data["cached"] + data["buffers"] + data["memfree"]) / data["memtotal"];
  }

  function calcUsage(data) {
    return 1 - calcFree(data);
  }

  fs.readFile("/proc/meminfo", function(err, data) {
    if (err) { return cb(err); }

    var meminfo = data.toString().split("\n");
    var data = {};

    for (var i in meminfo) {
      var line = meminfo[i].split(":");
      // Ignore invalid lines, if any
      if (line.length == 2) {
        data[line[0].trim().toLowerCase()] = parseInt(line[1].trim(), 10);
      }
    }

    cb(null, calcUsage(data) * 100);
  });
}


/**
 * This module calculates current memory usage.
 *
 * Platforms supported: linux, win32.
 */
var Mem = {

  /**
   * Asynchronously calculate total memory usage.
   * The callback is passed two arguments (err, result),
   * where result is the total memory usage in percentage.
   *
   * options: callback
   */
  usage: function(cb) {
    if (process.platform == "win32") {
    // Windows support
      getUsageWin32(cb);
    } else if (process.platform == "linux") {
    // Linux support
      getUsageLinux(cb);
    } else {
    // Not supported :(
      cb("Not supported platform " + process.platform);  
    }
  }
};

module.exports = Mem;