window.d3PieChart = (function (root) {

  var d3 = root.d3;

  function backgroundArcTween(transition, p, backgroundArc) {
    transition.attrTween("d", function (d) {
      return arcTween(d, backgroundArc, p);
    });
  }

  function foregroundArcTween(transition, newPrc, p, foregroundArc) {
    transition.attrTween("d", function (d) {
      var endAngle = ( p / 100 ) *  newPrc;
      return arcTween(d, foregroundArc, endAngle);
    });
  }

  function arcTween(d, arc, endAngle) {
    var interpolate = d3.interpolate(d.endAngle, endAngle);
    return function(t) {
      d.endAngle = interpolate(t);
      return arc(d);
    };
  }

  function indicatorTween(transition, newPrc, prc) {
    transition.tween("text", function () {
      var i = d3.interpolateNumber( prc, newPrc );
      return function(t) {
        var number = i(t);
        this.textContent = Number(number).toFixed(1) + "%";
      };
    });
  }

  function merge(obj1, obj2) {
    var obj3 = {}
    for (var attr in obj1) { obj3[attr] = obj1[attr]; }
    for (var attr in obj2) { obj3[attr] = obj2[attr]; }
    return obj3;
  }

  function setStyle(selection, style) {
    for (var attr in style) {
      selection.attr(attr, style[attr]);
    }
  }

  function appendFilterDropshadow(defs) {
    var filter = defs.append("filter")
      .attr("id", "dropshadow");
    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 2);
    filter.append("feOffset")
      .attr("dx", 4)
      .attr("dx", 4)
      .attr("result", "offsetblur");
    filter.append("feFlood")
      .attr("flood-color", "#000")
      .attr("flood-opacity", "0.5");
    filter.append("feComposite")
      .attr("in2", "offsetblur")
      .attr("operator", "in");

    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");
  }

  /**
   * PieChart Object
   */
  function PieChart(el, opt) {

    opt = opt || {};

    var prc = 0; // percentage
    var width = el.clientWidth - 20;
    var height = el.clientWidth - 20;

    var p = 2 * Math.PI;
    var r = (width / 2) - 10;

    // Indicator Style
    var indicatorStyle = merge({
      "fill": "#fff",
      "filter": "url(#dropshadow)",
      "text-anchor": "middle",
      "transform": "translate(0, 15)",
      "font-size": "38px",
      "style": "font-weight: bold"
    }, opt.indicatorStyle);

    // Background Arc Style
    var backgroundArcStyle = merge({
      "fill": "#000",
      "filter": "url(#dropshadow)"
    }, opt.backgroundArcStyle);

    // Foreground Arc Style
    var foregroundArcStyle = merge({
      "fill": "#fff",
      "filter": "url(#dropshadow)"
    }, opt.foregroundArcStyle);

    // Background Arc
    var backgroundArc = d3.svg.arc()
      .innerRadius(r - 15 - 50)
      .outerRadius(r - 15)
      .startAngle(0);

    // Foreground Arc
    var foregroundArc = d3.svg.arc()
      .innerRadius(r - 50)
      .outerRadius(r)
      .startAngle(0);

    // Canvas  
    var svg = d3.select(el).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var defs = svg.append("defs");
    defs.call(appendFilterDropshadow);

    // Components
    var background = null;
    var foreground = null;
    var indicator = null;

    //////////////////
    //    Public    //
    //////////////////

    this.draw = function() {
      // for some reasons if endAngle will be set as 0 for first time
      // it will cause animation bug
      var endAngle = 0.0001;
      background = svg.append("path")
        .datum({endAngle: endAngle})
        .attr("d", backgroundArc)
        .call(setStyle, backgroundArcStyle);
      foreground = svg.append("path")
        .datum({endAngle: endAngle})
        .attr("d", foregroundArc)
        .call(setStyle, foregroundArcStyle);
      indicator = svg.append("text")
        .text(prc + "%")
        .call(setStyle, indicatorStyle);
      return this;
    };

    this.updateBackground = function (duration) {
      background.transition()
        .duration(duration)
        .call(backgroundArcTween, p, backgroundArc);
      return this;
    };

    this.updateTick = function (memoryUsage, duration) {
      var newPrc = memoryUsage;
      foreground.transition()
        .duration(duration)
        .call(foregroundArcTween, newPrc, p, foregroundArc);
      indicator.transition()
        .duration(duration)
        .call(indicatorTween, newPrc, prc);
      prc = newPrc;
      return this;
    };
  }

  return PieChart;
})(window);
