(function() {
  var $upPanel = $("#upPanel");
  var $bottomPanel = $("#bottomPanel");
  var $splitter = $("#splitter");
  var $container = $("#container");
  var $document = $(document);
  
  $splitter.on("mousedown", function(e) {    
    toggleNoSelect();
    $document.on("mousemove", onMousemove);
    $document.on("mouseup", onMouseup);    
  });

  function onMousemove(e) {    
    var delta = e.pageY - $splitter.offset().top;
    var upHeight = $upPanel.height();
    $upPanel.height(upHeight + delta);    
  }

  function onMouseup() {    
    $document.off("mousemove", onMousemove);
    $document.off("mouseup", onMouseup);
    toggleNoSelect();
  }
  
  function toggleNoSelect() {
    $container.toggleClass("noselect");
  }
})();