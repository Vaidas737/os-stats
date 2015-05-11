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
  var AreaChartCpu = AreaChart.appendPath({ color: "red" });
  var AreaChartMemory = AreaChart.appendPath({ color: "blue" });

  // D3 Pie Charts
  var PieChartCpu = new d3PieChart(elPieChartCpu, { color: "red" });
  var PieChartMemory = new d3PieChart(elPieChartMemory, { color: "blue" });

  // Draw area charts
  AreaChart.startTick();

  // Draw pie charts
  PieChartCpu.updateBackground();
  PieChartMemory.updateBackground();

  // WebSocket
  var ws = new WebSocket("ws://" + loc.hostname + ":" + loc.port);
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    PieChartMemory.updateTick(normalizePerc(data.mem));
    PieChartCpu.updateTick(normalizePerc(data.cpu));

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