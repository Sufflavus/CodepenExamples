(function() {
  var canvasWidth = 800;
  var canvasHeight = 650;
  
  var chartWidth = 600;
  var chartHeight = 460;
     
  var tooltip = d3.select("#tooltip");
  var tooltipName = d3.select("#name");
  var tooltipYear = d3.select("#year");
  var tooltipTime = d3.select("#time");
  var tooltipDoping = d3.select("#doping");
    
  var dataUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
  
  // chart container
  var svg = d3.select("div.content")
    .append("svg")
    .attr({
      width: canvasWidth,
      height: canvasHeight
    })
    .append("g");
  
  svg.append("text")        
    .attr({
      class: "title",
      x: canvasWidth/2,
      y: 50
    })
    .text("Doping in Professional Bicycle Racing"); 
  
  svg.append("text")        
    .attr({
      class: "subtitle",
      x: canvasWidth/2,
      y: 90
    })
    .text("35 Fastest times up Alpe d'Huez"); 
  
  svg.append("text")        
    .attr({
      class: "sub-subtitle",
      x: canvasWidth/2,
      y: 120
    })
    .text("Normalized to 13.8km distance"); 
  
  // get data
  d3.json(dataUrl, function(error, dataSet) {
    if(error) {      
      return;
    } else {                       
      var dataSetLength = dataSet.length;
      
      var minSeconds = d3.min(dataSet, function(item) {
        return item.Seconds;
      }); 
      
      dataSet.forEach(function(item) {
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(item.Seconds - minSeconds);
        item.DateBehind = date;        
      });
      
      var minDate = d3.min(dataSet, function(item) {
        return item.DateBehind;
      }); 
      var maxDate = d3.max(dataSet, function(item) {
        return item.DateBehind;
      }); 
      
      var minValue = 0;   
      var maxValue = d3.max(dataSet, function(item) {
        return item.Place;
      });
      
      maxValue += 1;
            
      var x = d3.time.scale()
        .domain([minDate, maxDate])        
        .range([chartWidth, 0]);

      var y = d3.scale.linear()
        .domain([minValue, maxValue])
        .range([0, chartHeight]);
                               
      var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(d3.time.format("%M:%S"))
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)              
        .orient("left");
      
      var zeroX = 60;
                      
      var chart = svg.append("g")        
        .attr({
          width: chartWidth,
          height: chartHeight,
          transform: "translate(60, 120)"
        });
      
      // add x axis
      chart.append("g")
        .attr({
          class: "axis",
          transform: "translate(0, " + chartHeight + ")"        
        }) 
        .call(xAxis)
        .append("text") // add x axis name  
        .attr({
          x: chartWidth/2,
          y: 50
        })        
        .style("text-anchor", "middle")
        .text("Minutes Behind Fastest Time");

      // add y axis
      chart.append("g")
        .attr({
          class: "axis"                 
        })
        .call(yAxis)
        .append("text") // add y axis name     
        .attr({
          transform: "rotate(-90)",
          y: 6,
          dy: -40
        })   
        .style("text-anchor", "end")
        .text("Ranking");   
      
      var node = chart.selectAll(".node")
        .data(dataSet)
        .enter()
        .append("g")
        .attr({
          transform: function(d) { return "translate(" + x(d.DateBehind) + ", " + y(d.Place) + ")"; }          
        });
      
      node.append("circle")
        .attr({
          class: function(d) { return d.Doping ? "dot doping" : "dot" },
          r: 5
        }).on("mouseover", function(d) {                  
          tooltipName.text(d.Name + ": " + d.Nationality);        
          tooltipYear.text(d.Year);        
          tooltipTime.text(d.Time);
          tooltipDoping.text(d.Doping);

          tooltip.transition()
            .duration(500)
            .style("opacity", 0.8);

          tooltip.style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY + 10) + "px");
        }).on("mouseout", function(d) {        
          tooltip.transition()
            .duration(1000)
            .style("opacity", 0);
        });   
      
      node.append("text")
        .text(function (d) { return d.Name; })
        .attr({
          class: "label",
          x: 10,
          y: 4
        }); 
      
      var legendData = [{
        className: "dot",
        text: "No doping allegations"
      }, {
        className: "dot doping",
        text: "Riders with doping allegations"
      }];
      
      var legend = chart.selectAll(".legend")
        .data(legendData)
        .enter().append("g")
        .attr({
          class: "legend",
          transform: function(d, i) { return "translate(" + (chartWidth + 70) + ", " + (chartHeight - 200 + i * 20) + ")"; }
        });

      legend.append("circle")
        .attr({
          r: 7,
          class: function (d) { return d.className; }
        });

      legend.append("text")
        .attr({
          x: -15,
          y: 3,          
          class: "label"
        })        
        .style("text-anchor", "end")      
        .text(function(d) { return d.text; });           
    }
  });    
})();