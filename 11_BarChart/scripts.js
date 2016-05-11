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
      ds = data;
    }

    //buildLine();
  });
})();