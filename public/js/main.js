(function(root) {

  var doc = root.document;
  var loc = doc.location;
  var PieChart = root.d3PieChart;

  // DOM elements
  var elMemoryPieChart = doc.getElementById("memory-pie-chart");
  var elCpuPieChart = doc.getElementById("cpu-pie-chart");

  // D3 Pie Charts
  var PieChartMemory = new PieChart(elMemoryPieChart, {
    backgroundArcStyle: { fill: "#72d8eb", filter: "false" },
    foregroundArcStyle: { fill: "#e2f0f3", filter: "false" },
    indicatorStyle: { fill: "#e2f0f3", filter: "false" }
  });
  var PieChartCpu = new PieChart(elCpuPieChart, {
    backgroundArcStyle: { fill:  "#f69589", filter: "false" },
    foregroundArcStyle: { fill: "#ffe0dc", filter: "false" },
    indicatorStyle: { fill: "#ffe0dc", filter: "false" }
  });

  // Draw pie charts
  PieChartMemory.draw().updateBackground(1000);
  PieChartCpu.draw().updateBackground(1000);

  // WebSocket
  var ws = new WebSocket("ws://" + loc.hostname + ":" + loc.port);
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    PieChartMemory.updateTick(normalizePerc(data.mem));
    PieChartCpu.updateTick(normalizePerc(data.cpu.total));
  };

  /////////////////////////
  //        Utils        //
  /////////////////////////

  function normalizePerc(perc) {
    return Number( perc * 100 ).toFixed(1);
  }

})(window);