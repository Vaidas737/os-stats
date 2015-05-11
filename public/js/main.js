(function(root) {

  var doc = root.document;
  var loc = doc.location;
  var d3PieChart = root.d3PieChart;
  var d3AreaChart = root.d3AreaChart;

  // DOM elements
  var elAreaChart = doc.getElementById("area-chart");
  var elPieChartCpu = doc.getElementById("cpu-pie-chart");
  var elPieChartMemory = doc.getElementById("memory-pie-chart");

  // D3 Area Charts
  var AreaChart = new d3AreaChart(elAreaChart, { title: "OS Stats" });
  var AreaChartCpu = AreaChart.appendPath({ color: "red" });
  var AreaChartMemory = AreaChart.appendPath({ color: "blue" });

  // D3 Pie Charts
  var PieChartCpu = new d3PieChart(elPieChartCpu, { color: "red" });
  var PieChartMemory = new d3PieChart(elPieChartMemory, { color: "blue" });

  // Animate area chart
  AreaChart.startTick();

  // Animate pie chart
  PieChartCpu.updateBackground();
  PieChartMemory.updateBackground();

  function normalizePerc(perc) {
    return Number(perc).toFixed(1);
  }

  // WebSocket
  var ws = new WebSocket("ws://" + loc.hostname + ":" + loc.port);
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    // Update pie chart data
    PieChartMemory.updateTick(normalizePerc(data.mem));
    PieChartCpu.updateTick(normalizePerc(data.cpu));

    // Update area chart data
    AreaChartMemory.setData(normalizePerc(data.mem));
    AreaChartCpu.setData(normalizePerc(data.cpu));
  };

})(window);