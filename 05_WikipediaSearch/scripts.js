(function() {
  
  var $results = $("#results");
  
  $("#btn_search").click(function() {
    var request = getRequestText();
      
    if(!request.length) {
      return;
    }
    
    searchWiki(request);
  });
  
  function searchWiki(request) {
    $.ajax({
      url: "http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=" + request, 
      type: "GET",
      jsonp: "callback", 
      dataType: "jsonp",       
      success: function(response) {   
        if(!response.query) {
          return;
        }
        
        showResults(response.query.pages);        
      }
    });
  }
  
  function showResults(pages) {
    $results.html("").show();
        
    var divider = $("<div/>", {            
      class: "divider"
    }).appendTo($results);

    dictionaryForEach(pages, showResultSection);
  }
  
  function showResultSection(articleId, article) {
    var section = $("<div/>", {        
      class: "section invisible"
    }).appendTo($results);

    var title = $("<h5/>", {
      text: article.title
    }).appendTo(section);

    var content = $("<p/>", {
      text: article.extract,
      class: "grey-text text-darken-3"
    }).appendTo(section);

    var linkContainer = $("<p/>", {
      class: "card-action right-align"            
    }).appendTo(section);

    var link = $("<a/>", {
      class: "deep-orange-text text-lighten-2",
      text: "Open in a new tab",
      href: "http://en.wikipedia.org/?curid=" + article.pageid,
      target: "_blank"
    }).appendTo(linkContainer);

    var divider = $("<div/>", {            
      class: "divider"
    }).appendTo($results);

    section.fadeIn(2000); 
  }
  
  function getRequestText() {
    var request = $("#search_field").val();
    return trimString(request);    
  }
  
  function trimString(value) {
    return value.replace(/^\s+|\s+$/g, '');
  }
  
  function dictionaryForEach(dictionary, callback) {
    for (var key in dictionary) {
      if (!dictionary.hasOwnProperty(key)) { 
        continue; 
      }
      
      var value = dictionary[key];
      callback(key, value);
    }
  }
  
})();