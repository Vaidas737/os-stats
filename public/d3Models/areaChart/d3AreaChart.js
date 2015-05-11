window.d3AreaChart = (function (root) {

  var d3 = root.d3;

  var TIME_RANGE = 64;  // 60sec + 4sec = 64sec :)

  var DEFAULT_VALUE = 0;

  function generateBuffer() {
    return d3.range(TIME_RANGE).map(function() { return DEFAULT_VALUE; });
  }

  function getTimeScaleDomain(duration) {
    var now = new Date();
    return [now - (TIME_RANGE - 4) * duration, now];
  }

  function getTickTime(duration, tick) {
    tick = tick || 0;
    var now = new Date();
    return now - (TIME_RANGE - 3 - tick) * duration;
  }

  /**
   * Path Object
   */
  var Path = function(areaGroup, area, xScale, options) {

    var buffer = generateBuffer();
    var newData = 0;

    var path = areaGroup.append("path")
      .attr("class", "area " + options.color)
      .datum(buffer);

    /**
     *  Set new data.
     *  New data will be set to buffer on Path update.
     *
     * @param nd Value new data
     * @returns {window.d3AreaChart.Path}
     */
    this.setData = function(nd) {
      newData = nd;
      return this;
    };

    /**
     * Path update.
     * Update path and buffer.
     *
     * @returns {window.d3AreaChart.Path}
     */
    this.update = function() {

      // update buffer
      buffer.push(newData);
      buffer.shift();

      // redraw the path and slide left
      path
        .attr("d", area)
        .attr("transform", null)
        .transition()
          .attr("transform", "translate(" + xScale(getTickTime(options.duration)) + ", 0)");

      return this;
    }
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

    var paths = [];

    var yScale = d3.scale.linear()
      .range([0, height])
      .domain([0, dimension]);

    var xScale = d3.time.scale()
      .range([0, width])
      .domain(getTimeScaleDomain(duration));

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");

    var area = d3.svg.area()
      .x(function (d, i) { return xScale(getTickTime(duration, i)); })
      .y0(height)
      .y1(function (d) { return yScale(dimension - d); })
      .interpolate("basis");

    var svg = d3.select(el).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
        .attr("class", "area-chart");

    // append clip path
    svg.append("defs")
      .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);

    var xGroup = svg.append("g")
      .attr("class", "axis x")
      .attr("transform", "translate(0, " + (height - margin.bottom) + ")")
      .call(xAxis);

    var areaGroup = svg.append("g")
      .attr("clip-path", "url(#clip)")
      .attr("transform", "translate(0, " + - margin.top +  ")");

    var transition = d3.select({})
      .transition()
      .duration(duration)
      .ease("linear");

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

      // update time scale
      xScale.domain(getTimeScaleDomain(duration));

      // slide time scale left
      xGroup.call(xAxis).each(clearTimeScaleOverflow);

      // redraw paths and slide left
      for (var i in paths) {
        paths[i].update();
      }
    }

    function tick() {
      transition = transition
        .each(update)
        .transition()
          .each("start", tick);
    }

    /**
     * Start animation.
     *
     * @returns {window.d3AreaChart.AreaChart}
     */
    this.startTick = function() {
      tick();
      return this;
    };

    /**
     * Append path to chart.
     *
     * @param pathOptions Object
     * @returns {window.d3AreaChart.Path}
     */
    this.appendPath = function (pathOptions) {

      pathOptions = pathOptions || {};
      pathOptions.color = pathOptions.color || "";
      pathOptions.duration = duration;

      paths.push(new Path(areaGroup, area, xScale, pathOptions));

      return paths[paths.length - 1];
    };
  };

  return AreaChart;
})(window);