window.onload = function() {

  // DOM elements
  var elAreaChart = document.getElementById("area-chart");
  var elPieChartCpu = document.getElementById("cpu-pie-chart");
  var elPieChartMemory = document.getElementById("memory-pie-chart");

  // D3 Area Charts
  var areaChart = new AreaChart(elAreaChart, { title: "OS Stats" });
  var areaChartCpu = areaChart.appendPath({ color: "red" });
  var areaChartMemory = areaChart.appendPath({ color: "blue" });

  // D3 Pie Charts
  var pieChartCpu = new PieChart(elPieChartCpu, { color: "red" });
  var pieChartMemory = new PieChart(elPieChartMemory, { color: "blue" });

  // Animate area chart
  areaChart.startTick();

  // Animate pie chart
  pieChartCpu.updateBackground();
  pieChartMemory.updateBackground();

  function normalizePerc(perc) {
    return Number(perc).toFixed(1);
  }

  // WebSocket
  var ws = new WebSocket("ws://" + document.location.hostname + ":" + document.location.port);
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    // Update pie chart data
    pieChartMemory.updateTick(normalizePerc(data.mem));
    pieChartCpu.updateTick(normalizePerc(data.cpu.total));

    // Update area chart data
    areaChartMemory.setData(normalizePerc(data.mem));
    areaChartCpu.setData(normalizePerc(data.cpu.total));
  };
};