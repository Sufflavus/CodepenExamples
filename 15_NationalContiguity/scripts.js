(function() {
  var canvasWidth = 1250;
  var canvasHeight = 910;
  
  var chartWidth = 1250;
  var chartHeight = 500;
           
  var dataUrl = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
  
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
      y: 60
    })
    .text("National Contiguity");   
 
  // get data
  d3.json(dataUrl, function(error, dataSet) {
    if(error) {      
      return;
    } 
    
    var force = d3.layout.force()
      .charge(-100)
      .linkDistance(30)
      .size([chartWidth, chartHeight]);

    force
      .nodes(dataSet.nodes)
      .links(dataSet.links)
      .start();

    var chartTop = 200;

    var chart = svg.append("g")        
      .attr({
        width: chartWidth,
        height: chartHeight,
        transform: "translate(0, " + chartTop + ")"          
      });

    var link = chart.selectAll(".link")
      .data(dataSet.links)
      .enter()
      .append("line")
      .attr({
        class: "link"
      });

    var node = d3.select("div.content")
      .selectAll("div")
      .data(dataSet.nodes)
      .enter()
      .append("div")    
      .attr({
        class: function(d) { return "node flag flag-" + d.code; },
        title: function(d) { return d.country; }
      })             
      .call(force.drag);

    force.on("tick", function() {
      link.attr({
        x1: function(d) { return d.source.x; },
        y1: function(d) { return d.source.y; },
        x2: function(d) { return d.target.x; },
        y2: function(d) { return d.target.y; }
      });

      node    
        .style("top", function(d) {return chartTop + d.y + "px"})
        .style("left", function(d) {return d.x + "px"});         
    });         
  });    
})();