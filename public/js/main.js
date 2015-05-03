(function(root) {

  var doc = root.document;
  var loc = doc.location;
  var d3PieChart = root.d3PieChart;
  var d3LineChart = root.d3LineChart;

  // DOM elements
  var elLineChart = doc.getElementById("line-chart");
  var elPieChartCpu = doc.getElementById("cpu-pie-chart");
  var elPieChartMemory = doc.getElementById("memory-pie-chart");

  // D3 Line Charts
  var LineChart = new d3LineChart(elLineChart);
  var LineChartCpu = LineChart.appendChart({ color: "red" });
  var LineChartMemory = LineChart.appendChart({ color: "blue" });

  // D3 Pie Charts
  var PieChartCpu = new d3PieChart(elPieChartCpu, {
    backgroundArcStyle: { fill:  "#f69589", filter: "false" },
    foregroundArcStyle: { fill: "#ffe0dc", filter: "false" },
    indicatorStyle: { fill: "#ffe0dc", filter: "false" }
  });
  var PieChartMemory = new d3PieChart(elPieChartMemory, {
    backgroundArcStyle: { fill: "#72d8eb", filter: "false" },
    foregroundArcStyle: { fill: "#e2f0f3", filter: "false" },
    indicatorStyle: { fill: "#e2f0f3", filter: "false" }
  });

  // Draw line charts
  LineChartCpu.draw().startTick();
  LineChartMemory.draw().startTick();

  // Draw pie charts
  PieChartCpu.draw().updateBackground(1000);
  PieChartMemory.draw().updateBackground(1000);

  // WebSocket
  var ws = new WebSocket("ws://" + loc.hostname + ":" + loc.port);
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    PieChartMemory.updateTick(normalizePerc(data.mem), 1000);
    PieChartCpu.updateTick(normalizePerc(data.cpu.total), 1000);

    LineChartMemory.setData(normalizePerc(data.mem));
    LineChartCpu.setData(normalizePerc(data.cpu.total));
  };

  /////////////////////////
  //        Utils        //
  /////////////////////////

  function normalizePerc(perc) {
    return Number( perc * 100 ).toFixed(1);
  }

})(window);