var fs = require("fs");
var exec = require("child_process").exec;

function meminfoToJSON(data) {
  var meminfo = data.toString().split("\n");
  var json = {};
  for (var i in meminfo) {
    var line = meminfo[i].split(":");
    // Ignore invalid lines, if any
    if (line.length == 2) {
      json[line[0].trim().toLowerCase()] = parseInt(line[1].trim(), 10);
    }
  }
  return json;
}

function calcFree(meminfo) {
  return (meminfo["cached"] + meminfo["buffers"] + meminfo["memfree"]) / meminfo["memtotal"];
}

function calcUsed(meminfo) {
  return 1 - calcFree(meminfo);
}

/**
 * This module calculates current memory usage.
 */
var Mem = {

  /**
   * Asynchronously calculate total memory usage.
   * The callback is passed two arguments (err, result),
   * where result is the total memory usage in percentage.
   *
   * options: callback
   */
  used: function(cb) {
    if (process.platform == "win32") {
      var cm = "wmic os get TotalVisibleMemorySize && wmic os get FreePhysicalMemory";
      exec(cm, function(err, res, stderr) {
        
        if (err || stderr) {
          console.log("error");
          return;
        }


        var meminfo = res.split("\r\r\n");
        var json = {};
        var key = null;

        for (var i in meminfo) {
          var value = meminfo[i].trim();
          if (!isNaN(value) && +value > 0) {
            json[key] = +value;
          } else if (value.length > 0) {
            key = value;
          }
        }

        console.log(json);
        var result = (json["TotalVisibleMemorySize"] - json["FreePhysicalMemory"]) / json["TotalVisibleMemorySize"];
        cb(result * 100);
      });
    } else {
      fs.readFile("/proc/meminfo", function(err, data) {
      if (err) { cb(0); return; }
      var used = calcUsed( meminfoToJSON(data) );
      cb(used * 100);
    });
    }
  }
};

module.exports = Mem;