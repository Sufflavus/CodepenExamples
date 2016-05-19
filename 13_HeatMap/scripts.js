(function() {
  var canvasWidth = 1250;
  var canvasHeight = 710;
  
  var chartWidth = 1050;
  var chartHeight = 460;
     
  var palette = ["#313695", "#4575b4", "#74add1", "#abd9e9", "#e0f3f8", "#ffffbf", "#fee090", "#fdae61", "#f46d43", "#d73027", "#a50026"];
  
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
  var dataUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
  
  var tooltip = d3.select("#tooltip");
  var tooltipDate = d3.select("#date");
  var tooltipTemperature = d3.select("#temperature");
  var tooltipVariance = d3.select("#variance");
  
  var numberFormat = d3.format(",.2f");
  
  // chart container
  var svg = d3.select("div.content")
    .append("svg")
    .attr({
      width: canvasWidth,
      height: canvasHeight
    })
    .append("g");
  
  // title
  svg.append("text")        
    .attr({
      class: "title",
      x: canvasWidth/2,
      y: 40
    })
    .text("Monthly Global Land-Surface Temperature"); 
  
  svg.append("text")        
    .attr({
      class: "subtitle",
      x: canvasWidth/2,
      y: 75
    })
    .text("1753 - 2015"); 
  
  svg.append("text")        
    .attr({
      class: "description",
      x: canvasWidth/2,
      y: 100
    })
    .text("Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average."); 
  
  // description
  svg.append("text")        
    .attr({
      class: "description",
      x: canvasWidth/2,
      y: 120
    })
    .text("Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07"); 
  
  // get data
  d3.json(dataUrl, function(error, data) {
    if(error) {      
      return;
    }
    
    // prepare data
    var dataSet = data.monthlyVariance;    
    var dataSetLength = dataSet.length;
    var baseTemperature = data.baseTemperature;

    dataSet.forEach(function(item) {
      item.temperature = baseTemperature + item.variance;
    });
        
    var x = d3.scale.linear()
      .range([0, chartWidth])
      .domain(d3.extent(dataSet, function(d) { 
        return d.year; 
      }));
    
    var y = d3.scale.linear()
      .range([chartHeight, 0])
      .domain([12, 1]);
    
    var color = d3.scale.quantile()
      .range(palette)
      .domain(d3.extent(dataSet, function(d) { 
        return d.temperature; 
      }));
        
    var xAxis = d3.svg.axis()
      .scale(x)      
      .orient("bottom")      
      .tickFormat(function(d) {
        return "" + d;
      });

    var yAxis = d3.svg.axis()
      .scale(y)              
      .orient("left")      
      .tickFormat(function(d) {
        return months[d - 1];
      });      

    // chart container
    var chart = svg.append("g")        
      .attr({
        width: chartWidth,
        height: chartHeight,
        transform: "translate(100, 180)"
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
        y: 50,
        class: "axis-title"
      })        
      .style("text-anchor", "middle")
      .text("Years");
        
    // add y axis
    var yAxisElement = chart.append("g")
      .attr({
        class: "axis y-axis"                 
      })
      .call(yAxis);
    
    // change position of y-axis labels
    yAxisElement.selectAll("text")
      .attr({
        y: -22
      });
    
     // add y axis name
    yAxisElement.append("text")     
      .attr({
        transform: "rotate(-90)",
        y: -70,
        x: -chartHeight/2,
        class: "axis-title"
      })         
      .text("Months");  
    
    // add heat map
    chart.selectAll(".tile")
      .data(dataSet)
      .enter()
      .append("rect")
      .attr({
        class: "tile",
        x: function(d) { return x(d.year); },
        y: function(d) { return y(d.month - 1); },
        width: function(d) { return x(d.year) - x(d.year - 1); },
        height: function(d) { return y(d.month) - y(d.month - 1); }
      })      
      .style("fill", function(d) { return color(d.temperature); })
      .on("mouseover", function(d) {                  
        tooltipDate.text(d.year + " - " + months[d.month - 1]);        
        tooltipTemperature.text(numberFormat(d.temperature));        
        tooltipVariance.text(numberFormat(d.variance));
        
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
    
    // prepare data for legend
    var legendRawData = color.quantiles().slice();
    legendRawData.unshift(color.domain()[0]);
    legendRawData.push(color.domain()[1]);
    
    var legendData = legendRawData.map(function(item, index) {
      return {
        color: index < legendRawData.length - 1 ? color(item) : "#fff",
        value: numberFormat(item)
      };
    });
    legendData.reverse();
        
    // draw legend
    var legendWrapper = svg.append("g")
      .attr({
        transform: "translate(" + (chartWidth + 120) + ", 98)"
      });
    
    var legendRectSize = 20;
    var legend = legendWrapper.selectAll(".legend")
      .data(legendData)
      .enter()
      .append("g")
      .attr({
        class: "legend",
        transform: function(d, i) { return "translate(0," + (legendRectSize + i * legendRectSize) + ")"; }
      });

    legend.append("rect")
      .attr({
        width: legendRectSize,
        height: legendRectSize      
      })      
      .style("fill", function(d) { return d.color; });

    legend.append("text")
      .attr({
        x: 30,
        y: 23
      }) 
      .text(function(d) { return d.value; });    
  });    
})();