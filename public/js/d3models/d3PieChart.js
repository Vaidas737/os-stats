window.d3PieChart = (function(root) {

  var d3 = root.d3;

  function foregroundArcTween(transition, newPrc, p, foregroundArc) {
    transition.attrTween("d", function(d) {
      var interpolate = d3.interpolate(d.endAngle, (p / 100) * newPrc);
      return function(t) {
        d.endAngle = interpolate(t);
        return foregroundArc(d);
      };
    });
  }

  function indicatorTween(transition, newPrc, prc) {
    transition.tween("text", function() {
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

  //////////////////////////
  //    PieChart Object   //
  //////////////////////////

  function PieChart(el, opt) {

    opt = opt || {};

    var prc = 0; // percentage
    var width = el.clientWidth - 20;
    var height = el.clientWidth - 20;

    var p = 2 * Math.PI;
    var r = (width/2) - 10;

    // Indicator Style
    var indicatorStyle = merge({
      "fill": "#fff",
      "filter": "url(#dropshadow)",
      "text-anchor": "middle",
      "transform": "translate(0, 15)",
      "font-size": "43px",
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

    // start - filter
    var defs = svg.append( 'defs' );

    var filter = defs.append( 'filter' )
      .attr( 'id', 'dropshadow' )

    filter.append( 'feGaussianBlur' )
      .attr( 'in', 'SourceAlpha' )
      .attr( 'stdDeviation', 2 )
      .attr( 'result', 'blur' );
    filter.append( 'feOffset' )
      .attr( 'in', 'blur' )
      .attr( 'dx', 4 )
      .attr( 'dy', 4 )
      .attr( 'result', 'offsetBlur' );
    filter.append("feComponentTransfer").append("feFuncA")
      .attr("type", "linear")
      .attr("slope", "0.2");

    var feMerge = filter.append( 'feMerge' );

    feMerge.append( 'feMergeNode' )
      .attr( 'in", "offsetBlur' );
    feMerge.append( 'feMergeNode' )
      .attr( 'in', 'SourceGraphic' );
    // end - filter

    // Components
    var background = null;
    var foreground = null;
    var indicator = null;

    //////////////////
    //    Public    //
    //////////////////

    this.draw = function() {
      background = svg.append("path")
        .datum({endAngle: p}) // bind data to a single SVG element)
        .attr("d", backgroundArc)
        .call(setStyle, backgroundArcStyle);
      foreground = svg.append("path")
        .datum({endAngle: 0}) // bind data to a single SVG element
        .attr("d", foregroundArc)
        .call(setStyle, foregroundArcStyle);
      indicator = svg.append("text")
        .text(prc + "%")
        .call(setStyle, indicatorStyle);
      return this;
    };

    this.updateTick = function (memoryUsage) {
      var newPrc = memoryUsage;
      foreground.transition()
        .duration(750)
        .call(foregroundArcTween, newPrc, p, foregroundArc);
      indicator.transition()
        .duration(750)
        .call(indicatorTween, newPrc, prc);
      prc = newPrc;
      return this;
    };
  }

  return PieChart;
})(window);

