(function(){
  var canvasWidth = 500;
  var canvasHeight = canvasWidth*3/2;
  
  var sideLength = canvasWidth;
  var generationsCount = 6;
  
  var colorsCount = 100;
  
  var color = d3.scaleLinear().domain([1,colorsCount])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#71c7ec"), d3.rgb('#107dac'), d3.rgb('#189ad3'), d3.rgb('#1ebbd7'), d3.rgb('#005073')]);
    
  var svgContainer = d3.select("body").append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasHeight);
  
  var flake = new Flake(sideLength, generationsCount);
  var lines = flake.getLines();
  lines.forEach((l, index) => l.draw(color(index%colorsCount)));

 
  function Flake(sideLength, generationsCount) {
    var point1 = { x: 0, y: sideLength};
    var point2 = { x: sideLength, y: sideLength};
    var point3 = { x: sideLength/2, y: sideLength - Math.sqrt(Math.pow(sideLength,2) - Math.pow(sideLength/2,2))};
    
    function getLines() {
      var lines1 = generateSide(point2, point1);
      var lines2 = generateSide(point3, point2);
      var lines3 = generateSide(point1, point3);
      return lines1.concat(lines2).concat(lines3);
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