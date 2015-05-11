var fs = require("fs");

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
    fs.readFile("/proc/meminfo", function(err, data) {
      if (err) { return 0; }
      var used = calcUsed( meminfoToJSON(data) );
      cb(used * 100);
    });
  }
};

module.exports = Mem;