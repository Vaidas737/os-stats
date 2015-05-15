window.d3PieChart = (function(root) {

  var d3 = root.d3;

  /**
   * PieChart Object
   *
   * @param el DOM element
   * @param options Object
   * @constructor
   */
  function PieChart(el, options) {

    options = options || {};

    var color = options.color || "";
    var duration = options.duration || 1000;
    var margin = options.margin || { top: 20, right: 0, bottom: 0, left: 20 };

    var backgroundWidth = options.backgroundWidth || 50;
    var backgroundMargin = options.backgroundMargin || 10;
    var backgroundStartAngle = options.backgroundStartAngle || 0;

    var foregroundWidth = options.foregroundWidth || 50;
    var foregroundMargin = options.foregroundMargin || 0;
    var foregroundStartAngle = options.foregroundStartAngle || 0;

    var charMargin = options.charMargin || 10;

    var width = el.clientWidth;
    var height = el.clientWidth;

    var value = 0;
    var p = 2 * Math.PI;
    var r = (width / 2) - charMargin;

    // for some reasons if endAngle will be set as 0 for first time
    // it will cause animation bug
    var endAngle = 0.0001;

    var backgroundArc = d3.svg.arc()
      .innerRadius(r - backgroundMargin - backgroundWidth)
      .outerRadius(r - backgroundMargin)
      .startAngle(backgroundStartAngle);

    var foregroundArc = d3.svg.arc()
      .innerRadius(r - foregroundMargin - foregroundWidth)
      .outerRadius(r - foregroundMargin)
      .startAngle(foregroundStartAngle);

    var svg = d3.select(el).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
        .attr("class", "pie-chart")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var background = svg.append("path")
      .datum({ endAngle: endAngle })
      .attr("class", "background " + color)
      .attr("d", backgroundArc);

    var foreground = svg.append("path")
      .datum({ endAngle: endAngle })
      .attr("class", "foreground " + color)
      .attr("d", foregroundArc);

    var indicator = svg.append("text")
      .attr("class", "indicator " + color)
      .attr("transform", "translate(0, 15)")
      .text(value + "%");

    function backgroundArcTween(transition, endAngle) {
      transition.attrTween("d", function(d) {
        var interpolate = d3.interpolate(d.endAngle, endAngle);
        return function(t) {
          d.endAngle = interpolate(t);
          return backgroundArc(d);
        };
      });
    }

    function foregroundArcTween(transition, newValue) {
      transition.attrTween("d", function(d) {
        var endAngle = (p / 100) *  newValue;
        var interpolate = d3.interpolate(d.endAngle, endAngle);
        return function(t) {
          d.endAngle = interpolate(t);
          return foregroundArc(d);
        };
      });
    }

    function indicatorTween(transition, prevValue, newValue) {
      transition.tween("text", function() {
        var i = d3.interpolateNumber(prevValue, newValue);
        return function(t) {
          var number = i(t);
          this.textContent = Number(number).toFixed(1) + "%";
        };
      });
    }

    /**
     * Update chart background
     *
     * @returns {PieChart}
     */
    this.updateBackground = function() {
      background.transition()
        .duration(duration)
        .call(backgroundArcTween, p);
      return this;
    };

    /**
     * Update chart tick
     *
     * @param tickValue Number
     * @returns {PieChart}
     */
    this.updateTick = function(tickValue) {
      foreground.transition()
        .duration(duration)
        .call(foregroundArcTween, tickValue);
      indicator.transition()
        .duration(duration)
        .call(indicatorTween, value, tickValue);
      value = tickValue;
      return this;
    };
  }

  return PieChart;
})(window);