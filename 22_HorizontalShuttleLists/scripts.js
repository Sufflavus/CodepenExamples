(function() {
  var $upPanel = $("#upPanel");
  var $bottomPanel = $("#bottomPanel");
  var $splitter = $("#splitter");
  var $container = $("#container");
  var $document = $(document);
  var $topList = $("#topList");
  var $bottomList = $("#bottomList");
  
  initLists();
  
  function initLists() {
    var data = getData();
    
    data.topList.forEach(function(item) {      
      var $li = createListItem(item);   
      $li.appendTo($topList);
    });
    
    data.bottomList.forEach(function(item) {      
      var $li = createListItem(item);   
      $li.appendTo($bottomList);
    });
    
    function createListItem(text) {
      var $li = $("<li/>");
      var $label = $("<label/>").appendTo($li);      
      
      var $checkbox = $("<input />", {
        type: "checkbox"
      }).appendTo($label);   
      
      var $text = $("<span />", {
        text: text
      }).appendTo($label);    
      
      return $li;
    }
  }
  
  $splitter.on("mousedown", function(e) {    
    toggleNoSelect();
    $document.on("mousemove", onMousemove);
    $document.on("mouseup", onMouseup);    
  });
  
  $("#btnMoveDown").click(function() {
    var selectedItems = findSelectedItems($topList);  
    selectedItems.remove();
    selectedItems.appendTo($bottomList);    
  });
  
  $("#btnMoveUp").click(function() {
    var selectedItems = findSelectedItems($bottomList);  
    selectedItems.remove();
    selectedItems.appendTo($topList);    
  });
  
  function findSelectedItems($listElement) {
    return $listElement
      .find("input[type=checkbox]:checked")      
      .closest("li");
  }

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
  
  function getData() {
    return {
      topList: [
        "Lorem ipsum dolor sit amet",
        "Curabitur rhoncus velit eget",
        "Duis a diam non leo dapibus",
        "Phasellus nec dolor luctus",
        "Donec aliquet neque sit amet",
        "Suspendisse in arcu sit amet",
        "Quisque vitae nisi aliquam",
        "In non ipsum in sem aliquet",
        "Quisque id est condimentum",
      ],
      bottomList: [
        "Etiam aliquet turpis ac bibendum",
        "Praesent malesuada ex ac mi porta",
        "Morbi congue risus non metus",
        "Fusce a orci ac massa auctor suscipit",
        "Sed vitae metus sed nisi ullamcorper",
        "Vivamus suscipit quam sit amet",
        "Aenean eleifend nunc non rhoncus luctus",
        "In quis ipsum bibendum turpis fringilla",
        "Proin nec dolor eu turpis auctor pretium",
      ],
    };
  }
})();