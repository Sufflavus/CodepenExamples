(function () {
  var $body = $("body");
  var $table = $body.find("table");   
  var $tbody = $table.find("tbody");  
  var overflowClassName = "overflow";
  
  setCellsWidth();

  $(window).resize(onWindowResize).resize();
  
  function onWindowResize() {
    if(hasScrollBar($tbody)) {
      return;
    }
    
    if(hasScrollBar($body)) {
      $tbody.addClass(overflowClassName);      
    } else {
      $tbody.removeClass(overflowClassName);
    }
  }
  
  function hasScrollBar($element) {
    return $element.get(0).scrollHeight > $element.get(0).clientHeight;
  }
  
  function setCellsWidth() {
    var $headerCells = $table.find("thead tr").children();
    var $bodyFirstRowCells = $tbody.find("tr:first").children();
    var $footerCells = $table.find("tfoot tr").children();    
    
    var headerWidths = $headerCells.map(function() {      
      return $(this).width();
    }).get();
    
    $bodyFirstRowCells.each(setWidth);        
    $footerCells.each(setWidth);
    
    function setWidth(index, cell) {
      $(cell).width(headerWidths[index]);
    }    
  }
})();