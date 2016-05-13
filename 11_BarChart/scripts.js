//http://chimera.labs.oreilly.com/books/1230000000345/index.html

(function(){
  var w = 1000;
  var h = 600;
  
  var svg = d3.select("div")
    .append("svg")
    .attr({
      width: w,
      height: h
    });
  
  d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(error, data) {
    if(error) {
      console.log(error);
      return;
    } else {
      console.log(data);
      var dataSet = data.data;
      var minValue = 0;
      var maxValue = dataSet[0][1];
      var minYear = new Date(data.from_date).getYear() + 1900;
      var maxYear = new Date(data.to_date).getYear() + 1900;
      
      dataSet.forEach(function(item) {
        var value = item[1];        
        maxValue = value > maxValue  ? value : maxValue;
      });
      
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
    }

    //buildLine();
  });
})();