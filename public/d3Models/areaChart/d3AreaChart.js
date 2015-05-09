window.d3AreaChart = (function (root) {

  var d3 = root.d3;

  var BUFFER_SIZE = 63;

  var TIME_SCALE_RANGE = 1000; // 1min.

  function generateBuffer(data) {
    //var buffer = [];
    //for (var i = 0; i < BUFFER_SIZE; i++, buffer.push(data));
    //return buffer;
    return d3.range(BUFFER_SIZE).map(function() { return 0; });
  }

  function appendClipPath(defs, width, height) {
    defs
      .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);
  }

  function getTimeRange() {
    var now = new Date();
    return [now - (BUFFER_SIZE - 2) * TIME_SCALE_RANGE, now - BUFFER_SIZE];
  }

  /**
   * Path Object
   */
  var Path = function(groupe, options, area, xScale, timeAxis, xAxis, timeScale) {

    var color = options.color;

    var newData = 0;
    var buffer = generateBuffer(newData);

    var path = null;

    var transition = d3.select({})
      .transition()
        .duration(1000)
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
      var now = new Date();
      timeScale.domain([now - (BUFFER_SIZE - 3) * TIME_SCALE_RANGE, now]);

      buffer.push(newData);

      path
        .attr("d", area)
        .attr("transform", null);

      // slide time scale left
      timeAxis.call(xAxis).each(clearTimeScaleOverflow);

      // redraw the area and slide left
      path
        .transition()
          //.attr("transform", "translate(" + xScale(0) + ", 0)");
          .attr("transform", "translate(" + timeScale(now - (BUFFER_SIZE - 2) * TIME_SCALE_RANGE) + ", 0)");

      buffer.shift();
    }

    function tick() {
      transition = transition
        .each(update)
        .transition()
          .each("start", tick);
    }

    this.draw = function() {
      path = groupe.append("path")
        .attr("class", "chart-area " + color)
        .datum(buffer);
      return this;
    };

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
  var AreaChart = function(el) {

    var width = el.clientWidth - 20;
    var height = el.clientHeight - 20;

    var period = 60;      // 60sec
    var dimension = 100;  // 100%

    var xScale = d3.scale.linear()
      .range([0, width])
      .domain([1, period]);

    var yScale = d3.scale.linear()
      .range([0, height])
      .domain([0, dimension]);

    var now = new Date();
    // set time scale
    var timeScale = d3.time.scale()
      .range([0, width])
      .domain([now - (BUFFER_SIZE - 3) * TIME_SCALE_RANGE, now]);

    var xAxis = d3.svg.axis()
      .scale(timeScale)
      .orient("bottom");

    var area = d3.svg.area()
      //.x(function (d, i) { return xScale(i); })
      .x(function (d, i) {return timeScale(new Date() - (BUFFER_SIZE - 2 - i) * TIME_SCALE_RANGE); })
      .y0(height)
      .y1(function (d) { return yScale(dimension - d); })
      .interpolate("basis");

    var svg = d3.select(el).append("svg")
      .attr("width", width)
      .attr("height", height);

    var groupe = svg.append("g");

    var defs = groupe.append("defs");
    defs.call(appendClipPath, width, height);

    var timeAxis = groupe.append("g")
      .attr("transform", "translate(0, " + (height - 20) + ")")
      .call(xAxis);

    var areaGroupe = groupe.append("g")
      .attr("clip-path", "url(#clip)")
      .attr("transform", "translate(0, " + -20 +  ")");

    this.appendChart = function (options) {
      return new Path(areaGroupe, options, area, xScale, timeAxis, xAxis, timeScale);
    };
  };

  return AreaChart;
})(window);