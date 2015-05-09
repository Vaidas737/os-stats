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

function calcPercFree(meminfo) {
  return (meminfo["cached"] + meminfo["buffers"] + meminfo["memfree"]) / meminfo["memtotal"];
}

function calcPercUsed(meminfo) {
  return 1 - calcPercFree(meminfo);
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
      if (err) { cb(err, null); return; }
      var meminfo = meminfoToJSON(data);
      cb(null, calcPercUsed(meminfo));
    });
  }
};

module.exports = Mem;