(function(){
  var canvasWidth = 800;
  var canvasHeight = 800;
  
  var sideLength = canvasWidth;
  var generationsCount = 6;
  
  var colorsCount = 100;
    
  var svgContainer = d3.select("body").append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasHeight);
  
  var color = d3.scaleLinear().domain([1,colorsCount])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);
  
  var curve = new Curve(sideLength, generationsCount);
  var lines = curve.getLines();
  lines.forEach((l, index) => l.draw(color(index%colorsCount)));

 
  function Curve(sideLength, generationsCount) {
    var point1 = { x: 0, y: sideLength/3};
    var point2 = { x: sideLength, y: sideLength/3};
    
    function getLines() {
      return generateSide(point1, point2);
    }
    
    function generateSide(start, end) {
      var line = new Line(start, end);
      var lines = getNextGeneration([line]);

      for(var j=2; j<=generationsCount; j++) {
        lines = getNextGeneration(lines);
      }

      return lines;
    }

    function getNextGeneration(lines) {
      var nextGeneration = [];
      for(var i = 0, length = lines.length; i < length; i++) {
        var l = lines[i];
        let a = l.kochA();
        let b = l.kochB();
        let c = l.kochC();
        let d = l.kochD();
        let e = l.kochE();

        nextGeneration.push(new Line(a, b));
        nextGeneration.push(new Line(b, c));
        nextGeneration.push(new Line(c, d));
        nextGeneration.push(new Line(d, e));
      }

      return nextGeneration;
    }
    
    return {
      getLines: getLines
    }
  }
  
  function Line(start, end) {
    var start = start;
    var end = end;
    
    function draw(color) {
      svgContainer.append("line") 
        .style("stroke", color) 
        .attr("x1", start.x) 
        .attr("y1", start.y) 
        .attr("x2", end.x) 
        .attr("y2", end.y);
    }
    
    function kochA() {
      return start;
    }
    
    function kochB() {
      return {
        x: start.x + (end.x - start.x)/3,
        y: start.y + (end.y - start.y)/3
      };
    }
    
    function kochC() {
      i=1;
      var length = Math.sqrt(Math.pow(start.x - end.x,2) + Math.pow(start.y - end.y,2));
      var height = length/(2*Math.sqrt(3));
      var sina = (end.y - start.y)/length;
      var cosa = (end.x - start.x)/length;
      
      return {
        x: (end.x + start.x)/2 + height * i * sina,
        y: (end.y + start.y)/2 - height * i * cosa
      };
    }
    
    function kochD() {
      return {
        x: start.x + (end.x - start.x)*2/3,
        y: start.y + (end.y - start.y)*2/3
      };
    }
    
    function kochE() {
      return end;
    }
    
    function getTan(degrees) {
      return Math.tan(degrees * Math.PI/180);
    }
    
    return {
      draw: draw,
      kochA: kochA,
      kochB: kochB,
      kochC: kochC,
      kochD: kochD,
      kochE: kochE
    }
  }  
})();

// http://natureofcode.com/book/chapter-8-fractals/