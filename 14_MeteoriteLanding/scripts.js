// https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json
// http://bl.ocks.org/mbostock/d4021aa4dccfd65edffd
// http://bl.ocks.org/mbostock/4987520
// http://bl.ocks.org/mbostock/eec4a6cda2f573574a11
// http://bl.ocks.org/mbostock/8fadc5ac9c2a9e7c5ba2

// world map is based on example http://bl.ocks.org/mbostock/8fadc5ac9c2a9e7c5ba2
(function() {
  var mapUrl = "https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json";
  
  var meteoriteUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json"
  
  var bodyRect = d3.select(".content").node().getBoundingClientRect();
  
  var width = bodyRect.width;
  var height = bodyRect.height;

  var projection = d3.geo.mercator()
    .translate([width / 2, height / 2])
    .scale((width - 1) / 2 / Math.PI);

  var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select(".content")
    .append("svg")
    .attr({
      width: width,
      height: height
    })    
    .append("g");

  var g = svg.append("g");

  svg.append("rect")
    .attr({
      class: "overlay",
      width: width,
      height: height
    });

  svg.call(zoom).call(zoom.event);

  d3.json(mapUrl, function(error, world) {
    if (error) {
      throw error;
    }

    g.append("path")
      .datum({ type: "Sphere" })
      .attr({
        class: "sphere",
        d: path
      });

    g.append("path")
      .datum(topojson.merge(world, world.objects.countries.geometries))
      .attr({
        class: "land",
        d: path
      });

    g.append("path")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr({
        class: "boundary",
        d: path
      });
    
    d3.json(meteoriteUrl, function(error, data) {
      if(error) {      
        return;
      }
      //console.log(data)
      var meteors = data.features.filter(function(item) {
        return !!item.geometry && (+item.properties.mass) > 0;
      });
            
      var minSize = d3.min(meteors, function(d) { 
        return +d.properties.mass; 
      });
      
      var maxSize = d3.max(meteors, function(d) { 
        return +d.properties.mass; 
      });                 
            
      g.selectAll("circle")
        .data(meteors)
        .enter()
        .append("circle")          
        .attr("cx", function (d) { return projection(d.geometry.coordinates)[0]; })
        .attr("cy", function (d) { return projection(d.geometry.coordinates)[1]; })
        .attr("r", function (d) { 
          var mass = d.properties.mass;
          if(mass > maxSize/10) {
            return 40;
          }
        
          if(mass > maxSize/100) {
            return 20;
          }
        
          if(mass > maxSize/1000) {
            return 10;
          }                 
        
          if(mass > maxSize/10000) {
            return 5;
          }
        
          return 2;        
        })
        .attr("opacity", "0.5")
        .attr("fill", "#7E142E")
    });    
  });

  function zoomed() {
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }
})();