(function() {
  var canvasWidth = 1050;
  var canvasHeight = 650;
  
  var chartWidth = 900;
  var chartHeight = 470;
  
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  var numberFormat = d3.format("$,.2f");
  
  var tooltip = d3.select("#tooltip");
  var tooltipValue = d3.select("#value");
  var tooltipYear = d3.select("#year");
  var tooltipMonth = d3.select("#month");
    
  var dataUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  
  // chart container
  var svg = d3.select("div.content")
    .append("svg")
    .attr({
      width: canvasWidth,
      height: canvasHeight
    })
    .append("g");
  
  // get data
  d3.json(dataUrl, function(error, data) {
    if(error) {      
      return;
    } else {            
      var description = data.description;
      
      var dataSet = data.data.map(function(item) {
        return {
          date: new Date(item[0]),
          value: item[1]
        };
      }); 
      
      var dataSetLength = dataSet.length;
      
      var minDate = new Date(data.from_date);
      var maxDate = new Date(data.to_date);
      
      var minValue = 0;   
      var maxValue = d3.max(dataSet, function(item) {
        return item.value;
      }); 
            
      var title = svg.append("text")        
        .attr({
          class: "title",
          x: canvasWidth/2,
          y: 50
        })
        .text("Gross Domestic Product");      
      
      var x = d3.time.scale()
	      .domain([minDate, maxDate])
        .range([0, chartWidth]);

      var y = d3.scale.linear()
        .domain([minValue, maxValue])
        .range([chartHeight, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
      
      var chart = svg.append("g")        
        .attr({
          width: chartWidth,
          height: chartHeight,
          transform: "translate(80, 70)"
        });
      
      // add x axis
      chart.append("g")
        .attr({
          class: "axis",
          transform: "translate(0," + chartHeight + ")"        
        }) 
        .call(xAxis);

      // add y axis
      chart.append("g")
        .attr({
          class: "axis"                 
        })
        .call(yAxis);
      
      // add y axis name
      svg.append("text")        
        .attr({                     
          transform: "translate(100,275) rotate(270)"
        })        
        .text("Gross Domestic Product, USA");
      
      // add bars
      chart.selectAll(".bar")
        .data(dataSet) 
        .enter()
        .append("rect")
        .attr({
          class: "bar",
          x: function(d) { return x(d.date); },
          y: function(d) { return y(d.value); },
          height: function(d) { return chartHeight - y(d.value); },
          width: chartWidth / dataSetLength
        })
        .on("mouseover", function(d) {
          d3.select(this).attr({ class: "bar hovered" });
        
          tooltipValue.text(numberFormat(d.value));        
          tooltipYear.text(d.date.getFullYear());        
          tooltipMonth.text(months[d.date.getMonth()]);

          tooltip.transition()
            .duration(500)
            .style("opacity", 0.8);

          tooltip.style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
        })
        .on("mouseout", function(d) {
          d3.select(this).attr({ class: "bar" });
        
          tooltip.transition()
            .duration(1000)
            .style("opacity", 0);
        });
      
      // add chart description
      var descriptionText = svg.append("text")        
        .attr({
          class: "description",          
          x: canvasWidth/2,
          y: canvasHeight - 60,
          dy: 20
        })        
        .text(description);
      
      wrapWords(descriptionText, canvasWidth);
    }
  });
     
  // this code came from here https://github.com/d3/d3/issues/1642
  function wrapWords(text, width) {
    text.each(function() {      
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 20,
          x = text.attr("x"),
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy);
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy).text(word);
        }
      }
    });
  }
})();