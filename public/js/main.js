(function(root) {

  var doc = root.document;
  var loc = doc.location;
  var d3PieChart = root.d3PieChart;
  var d3AreaChart = root.d3AreaChart;

  // DOM elements
  var elLineChart = doc.getElementById("line-chart");
  var elPieChartCpu = doc.getElementById("cpu-pie-chart");
  var elPieChartMemory = doc.getElementById("memory-pie-chart");

  // D3 Area Charts
  var AreaChart = new d3AreaChart(elLineChart);
  var AreaChartCpu = AreaChart.appendChart({ color: "red" });
  var AreaChartMemory = AreaChart.appendChart({ color: "blue" });

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

  // Draw area charts
  AreaChartCpu.draw().startTick();
  AreaChartMemory.draw().startTick();

  // Draw pie charts
  PieChartCpu.draw().updateBackground(1000);
  PieChartMemory.draw().updateBackground(1000);

  // WebSocket
  var ws = new WebSocket("ws://" + loc.hostname + ":" + loc.port);
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    PieChartMemory.updateTick(normalizePerc(data.mem), 1000);
    PieChartCpu.updateTick(normalizePerc(data.cpu), 1000);

    AreaChartMemory.setData(normalizePerc(data.mem));
    AreaChartCpu.setData(normalizePerc(data.cpu));
  };

  /////////////////////////
  //        Utils        //
  /////////////////////////

  function normalizePerc(perc) {
    return Number( perc * 100 ).toFixed(1);
  }

})(window);