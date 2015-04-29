(function(root) {

  var doc = root.document;
  var loc = doc.location;
  var PieChart = root.d3PieChart;

  // DOM elements
  var elMemoryPieChart = doc.getElementById("memory-pie-chart");
  var elCpuPieChart = doc.getElementById("cpu-pie-chart");

  // D3 Pie Charts
  var PieChartMemory = new PieChart(elMemoryPieChart, {
    backgroundArcStyle: { fill: "#72d8eb" },
    foregroundArcStyle: { fill: "#e2f0f3" },
    indicatorStyle: { fill: "#e2f0f3" }
  }).draw();
  var PieChartCpu = new PieChart(elCpuPieChart, {
    backgroundArcStyle: { fill:  "#f69589" },
    foregroundArcStyle: { fill: "#ffe0dc" },
    indicatorStyle: { fill: "#ffe0dc" }
  }).draw();

  // WebSocket
  var ws = new WebSocket("ws://" + loc.hostname + ":" + loc.port);
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    PieChartMemory.updateTick(normalizePerc(data.mem));
    PieChartCpu.updateTick(normalizePerc(data.cpu));
  };

  /////////////////////////
  //        Utils        //
  /////////////////////////

  function normalizePerc(perc) {
    return Number( perc * 100 ).toFixed(1);
  }

})(window);