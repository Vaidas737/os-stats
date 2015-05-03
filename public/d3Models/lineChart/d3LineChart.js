window.d3LineChart = (function (root) {

  var d3 = root.d3;

  var BUFFER_SIZE = 62;

  function generateBuffer(data) {
    var buffer = [];
    for (var i = 0; i < BUFFER_SIZE; i++, buffer.push(data));
    return buffer;
  }

  function appendClipPath(defs, width, height) {
    defs
      .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);
  }

  /**
   * LineChart Object
   */
  function LineChart(el) {

    var width = el.clientWidth - 20;
    var height = el.clientHeight - 20;

    var period = 60;  // 60sec
    var dimension = 100;  // 100%

    var xScale = d3.scale.linear()
      .range([0, width])
      .domain([1, period]);

    var yScale = d3.scale.linear()
      .range([0, height])
      .domain([0, dimension]);

    var area = d3.svg.area()
      .x(function (d, i) { return xScale(i); })
      .y0(height)
      .y1(function (d) { return yScale(dimension - d); })
      .interpolate("basis");

    var svg = d3.select(el).append("svg")
      .attr("width", width)
      .attr("height", height);

    var defs = svg.append("defs");
    defs.call(appendClipPath, width, height);

    var groupe = svg.append("g")
      .attr("clip-path", "url(#clip)");

    //////////////////
    //    Public    //
    //////////////////

    this.appendChart = function (options) {
      return new Path(groupe, options, area, xScale);
    };
  }

  /**
   * Path Object
   */
  function Path(groupe, options, area, xScale) {

    var color = options.color;

    var newData = 0;
    var buffer = generateBuffer(newData);

    var path = null;

    function tick() {
      buffer.push(newData);

      // update with animation
      path
        .attr("d", area)
        .attr("transform", null)
        .transition()
          .duration(1000)
          .ease("linear")
          .attr("transform", "translate(" + xScale(0) + ", 0)")
          .each("end", tick);

      buffer.shift();
    }

    //////////////////
    //    Public    //
    //////////////////

    this.draw = function () {
      path = groupe.append("path")
        .attr("class", "chart-area " + color)
        .datum(buffer)
        .attr("d", area);
      return this;
    };

    this.setData = function (nd) {
      newData = nd;
      return this;
    };

    this.startTick = function () {
      tick();
      return this;
    };
  }

  return LineChart;
})(window);