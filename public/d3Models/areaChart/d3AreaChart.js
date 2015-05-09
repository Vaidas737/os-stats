window.d3AreaChart = (function (root) {

  var d3 = root.d3;

  var TIME_RANGE = 63;  // 60sec + 3sec = 63sec :)

  function generateBuffer() {
    return d3.range(TIME_RANGE).map(function() { return 0; });
  }

  function getTimeScaleDomain(duration) {
    var now = new Date();
    return [now - (TIME_RANGE - 3) * duration, now];
  }

  function getTickTime(duration, tick) {
    tick = tick || 0;
    var now = new Date();
    return now - (TIME_RANGE - 2 - tick) * duration;
  }

  /**
   * Path Object
   */
  var Path = function(group, area, timeAxis, xAxis, xScale, duration, options) {

    var color = options.color || "";
    var buffer = generateBuffer();
    var newData = 0;

    // Main transition
    var transition = d3.select({})
      .transition()
        .duration(duration)
        .ease("linear");

    // Cart path
    var path = group.append("path")
      .attr("class", "area " + color)
      .datum(buffer);

    function clearTimeScaleOverflow() {
      // NOTE: {this} refers to DOM element.
      var g = d3.select(this).selectAll("g.tick");
      g.each(function() {
        var n = d3.select(this);
        var t = d3.transform(n.attr("transform"));
        var x = t.translate[0];
        if (x < 0) { n.remove(); }
      });
    }

    function update() {

      buffer.push(newData);

      // update time scale
      xScale.domain(getTimeScaleDomain(duration));

      // slide time scale left
      timeAxis.call(xAxis).each(clearTimeScaleOverflow);

      // redraw the area and slide left
      path
        .attr("d", area)
        .attr("transform", null)
        .transition()
          .attr("transform", "translate(" + xScale(getTickTime(duration)) + ", 0)");

      buffer.shift();
    }

    function tick() {
      transition = transition
        .each(update)
        .transition()
          .each("start", tick);
    }

    this.setData = function(nd) {
      newData = nd;
      return this;
    };

    this.startTick = function() {
      tick();
      return this;
    };
  };

  /**
   * LineChart Object
   */
  var AreaChart = function(el, options) {

    options = options || {};

    var dimension = options.dimension || 100;
    var duration = options.duration || 1000; // in milliseconds
    var margin = options.margin || { top: 20, right: 0, bottom: 20, left: 20 };

    var width = el.clientWidth - margin.left;
    var height = el.clientHeight - margin.top;

    // Y scale
    var yScale = d3.scale.linear()
      .range([0, height])
      .domain([0, dimension]);

    // Time scale
    var xScale = d3.time.scale()
      .range([0, width])
      .domain(getTimeScaleDomain(duration));

    // Time axis
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");

    // Area
    var area = d3.svg.area()
      .x(function (d, i) { return xScale(getTickTime(duration, i)); })
      .y0(height)
      .y1(function (d) { return yScale(dimension - d); })
      .interpolate("basis");

    // Canvas
    var svg = d3.select(el).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
        .attr("class", "area-chart");

    // Append clip path
    svg.append("defs")
      .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);

    // Append time axis group
    var xGroup = svg.append("g")
      .attr("class", "axis x")
      .attr("transform", "translate(0, " + (height - margin.bottom) + ")")
      .call(xAxis);

    // Append area group
    var areaGroup = svg.append("g")
      .attr("clip-path", "url(#clip)")
      .attr("transform", "translate(0, " + - margin.top +  ")");

    this.appendChart = function (charOptions) {
      charOptions = charOptions || {};
      return new Path(areaGroup, area, xGroup, xAxis, xScale, duration, charOptions);
    };
  };

  return AreaChart;
})(window);