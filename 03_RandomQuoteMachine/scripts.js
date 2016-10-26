(function() {
  var $quote = $("blockquote");
  var $quoteContent = $("blockquote p");
  var $quoteTitle = $("blockquote footer");
  var $btnTweet = $("#btnTweet");
  var $btnRefresh = $("#btnRefresh");
  
  showNewQuote();
  
  $btnRefresh.click(showNewQuote);
  
  function showNewQuote() {
    getQuote().then(updateQuote);
  }
  
  function getQuote() {
    var url = generateNewQuoteUrl();
    return $.getJSON(url)
      .then(function(result) {      
        var quoteData = result[0];
        var content = $(quoteData.content).text();
      
        return {
          content: content,
          title: quoteData.title
        };        
      });
  }    
  
  function updateQuote(quote) {
    $quote.fadeOut(500, function() {
        $quoteContent.html(quote.content);
        $quoteTitle.text(quote.title);
        $(this).fadeIn(500);      
        var tweetUrl = generateTweetUrl(quote);
        $btnTweet.attr("href", tweetUrl);
    });   
  }
  
  function generateNewQuoteUrl() {
    var ts = new Date().getTime();
    return "//quotesondesign.com/wp-json/posts?" + 
      "filter[orderby]=rand&filter[posts_per_page]=1&callback=&_=" + ts;
  }
  
  function generateTweetUrl(quote) {
    return "//twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=" + 
      encodeURIComponent("'" + quote.content + "' " + quote.title);
  }
})();