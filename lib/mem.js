/**
 * Module mem.
 * This module calculates current memory usage.
 *
 * NOTE:
 * This module tested on Ubuntu 14.04 (Linux), may not work on Windows or OSX machines.
 */

var fs = require("fs");

// The module to be exported.
var mem = module.exports;

/**
 * Asynchronously calculate total memory usage.
 * The callback is passed two arguments (err, result),
 * where result is the total memory usage in percentage.
 *
 * options: callback
 */
mem.used = function (cb) {
  if (typeof cb != "function") { return; }
  fs.readFile("/proc/meminfo", function (err, data) {
    if (err) { cb(err, null); }
    var meminfo = meminfoToJSON(data);
    cb(null, calcPercUsed(meminfo));
  });
};

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
