(function() {
  var $quote = $("blockquote");
  var $quoteContent = $("blockquote p");
  var $quoteTitle = $("blockquote footer");
  var $btnTweet = $("#btnTweet");
  
  showNewQuote();
  
  $("#btnRefresh").click(showNewQuote);
  
  function showNewQuote() {
    getQuote(updateQuote);
  }
  
  function getQuote(callBack) {
    var ts = new Date().getTime();
    $.getJSON("http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=" + "&_=" + ts, function(result) {
      var quoteData = result[0];
      var content = $(quoteData.content).text();
      callBack(content, quoteData.title);
    });
  }  
  
  function updateQuote(content, title) {
    $quote.fadeOut(500, function() {
        $quoteContent.html(content);
        $quoteTitle.text(title);
        $(this).fadeIn(500);        
        $btnTweet.attr('href', 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text='+ encodeURIComponent('"' + content + '" ' + title));
    });   
  }
})();