// world map is based on example http://bl.ocks.org/mbostock/8fadc5ac9c2a9e7c5ba2

(function() {
  var mapUrl = "https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json";
  
  var meteoriteUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json"
  
  var bodyRect = d3.select(".content").node().getBoundingClientRect();
  
  var width = bodyRect.width;
  var height = bodyRect.height;
  
  var tooltip = d3.select("#tooltip");
  var tooltipName = d3.select("#name");
  var tooltipRecclass = d3.select("#recclass");
  var tooltipMass = d3.select("#mass");
  var tooltipYear = d3.select("#year");
  var tooltipFall = d3.select("#fall");
  var tooltipNametype = d3.select("#nametype");
  var tooltipLong = d3.select("#long");
  var tooltipLat = d3.select("#lat");

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

  svg.call(zoom).call(zoom.event);

  d3.json(mapUrl, function(error, world) {
    if (error) {
      throw error;
    }

    // draw map
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
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { 
        return a !== b; 
      }))
      .attr({
        class: "boundary",
        d: path
      });
    
    d3.json(meteoriteUrl, function(error, data) {
      if(error) {      
        return;
      }
      
      var meteors = data.features.filter(function(item) {
        return !!item.geometry && (+item.properties.mass) > 0;
      });            
            
      var maxMass = d3.max(meteors, function(d) { 
        return +d.properties.mass; 
      });                 
          
      // draw meteors
      g.selectAll("circle")
        .data(meteors)
        .enter()
        .append("circle")
        .attr({
          cx: function (d) { return projection(d.geometry.coordinates)[0]; },
          cy: function (d) { return projection(d.geometry.coordinates)[1]; },
          r: getRadius
        })                
        .on("mouseover", function(d) {   
          d3.select(this).attr({ class: "hovered" });        
          fillTooltip(d);

          tooltip.transition()
            .duration(500)
            .style("opacity", 0.8);

          tooltip.style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY + 10) + "px");
        }).on("mouseout", function(d) { 
          d3.select(this).attr({ class: "" });
          tooltip.transition()
            .duration(1000)
            .style("opacity", 0);
        });
      
        function getRadius(d) {
          var mass = d.properties.mass;
          if(mass > maxMass/10) {
            return 40;
          }
        
          if(mass > maxMass/100) {
            return 20;
          }
        
          if(mass > maxMass/1000) {
            return 10;
          }                 
        
          if(mass > maxMass/10000) {
            return 5;
          }
        
          return 2;  
        }
      
        function fillTooltip(d) {
          tooltipName.text(d.properties.name);        
          tooltipRecclass.text(d.properties.recclass);        
          tooltipMass.text(d.properties.mass);
          tooltipYear.text((new Date(d.properties.year)).getFullYear());
          tooltipFall.text(d.properties.fall);
          tooltipNametype.text(d.properties.nametype);
          tooltipLong.text(d.properties.reclong);
          tooltipLat.text(d.properties.reclat);
        }
    });    
  });

  function zoomed() {
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }
})();