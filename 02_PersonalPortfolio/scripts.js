(function($){
  //var navOffset = $('#navbar').height();
  var navOffset = 50;

  $(".navbar li a").click(function(event) {
      event.preventDefault();
      $($(this).attr("href"))[0].scrollIntoView();
      scrollBy(0, -navOffset);
  });
})($);