//http://chimera.labs.oreilly.com/books/1230000000345/index.html
//https://bl.ocks.org/mbostock/7441121

(function() {
  var canvasWidth = 1050;
  var canvasHeight = 650;
  
  var chartWidth = 900;
  var chartHeight = 470;
  
  var dataUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  
  var svg = d3.select("div")
    .append("svg")
    .attr({
      width: canvasWidth,
      height: canvasHeight
    })
    .append("g");
  
  d3.json(dataUrl, function(error, data) {
    if(error) {
      //console.log(error);
      return;
    } else {
      //console.log(data);
      var name = data.name;
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
        .text(name);
      
      /* console.log(minValue)
      console.log(maxValue)
      
      console.log(minYear)
      console.log(maxYear) */
      
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
      
      chart.append("g")
        .attr({
          class: "axis",
          transform: "translate(0," + chartHeight + ")"        
        }) 
        .call(xAxis);

      chart.append("g")
        .attr({
          class: "axis"                 
        })
        .call(yAxis);
      
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
        });
      
      var descriptionText = svg.append("text")        
        .attr({
          class: "description",          
          x: canvasWidth/2,
          y: canvasHeight - 60,
          dy: 20
        })
        //.call(wrap, canvasWidth);
        .text(description);
      
      wrap(descriptionText, canvasWidth);
    }

    //buildLine(); #6FB88F
  });
  
  //code is from here https://github.com/d3/d3/issues/1642
  function wrap(text, width) {
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