//http://chimera.labs.oreilly.com/books/1230000000345/index.html
//https://bl.ocks.org/mbostock/7441121

(function(){
  var canvasWidth = 1050;
  var canvasHeight = 650;
  
  var chartWidth = 1000;
  var chartHeight = 680;
  
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
      var dataSet = data.data; 
      
      var minYear = new Date(data.from_date).getYear() + 1900;
      var maxYear = new Date(data.to_date).getYear() + 1900;
      
      var minValue = 0;   
      var maxValue = d3.max(dataSet, function(item) {
        return item[1];
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
      
      var x = d3.scale.linear()
        .range([maxValue, minValue]);

      var y = d3.scale.linear()
        .range([maxYear, minYear]);

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
          transform: "translate(0, 70)"
        });
    }

    //buildLine(); #6FB88F
  });
})();