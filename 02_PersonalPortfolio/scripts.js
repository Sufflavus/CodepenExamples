(function($){
  var navOffset = $('#navbar').height();  

  $(".navbar li a").click(function(event) {
      event.preventDefault();
      $($(this).attr("href"))[0].scrollIntoView();
      scrollBy(0, -navOffset);
  });
})($);