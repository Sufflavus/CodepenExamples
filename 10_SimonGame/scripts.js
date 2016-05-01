(function() {
  $("#btnStrict").click(function() {
    $("#btnStrict").toggleClass("accent-1");
  });
  
  $("#switch").change(function() {     
    if($("#switchCheckbox").prop("checked") == true) {
      $("#score").text("00");      
    } else {
      $("#score").text("");
      $("#btnStrict").removeClass("accent-1");
    }
        
    $("button").prop("disabled", function(i, v) { return !v; });
  })
})();