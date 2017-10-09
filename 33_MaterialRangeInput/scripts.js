// https://material.io/guidelines/components/sliders.html#
// https://material.io/color/#!/?view.left=0&view.right=0&primary.color=F4511E
// https://material.io/guidelines/style/color.html#color-color-tool
// https://stackoverflow.com/questions/6339480/how-to-detect-if-a-browser-is-chrome-using-jquery
// https://www.templatemonster.com/help/how-to-create-browser-specific-css-rules-styles.html
// https://stackoverflow.com/questions/19291985/put-browser-specific-condition-in-css-selector

(function($) {  
  var $range = $('input[type="range"]');
  var trackColor = "#b5b5b6";
  var thumbColor = "#ef6c00"; 
  
  setRangeColor($range);
  
  $range.change(function () {
    var $this = $(this);    
    setRangeColor($this);
  }); 
  
  function setRangeColor($element) {
    var min = $element.attr('min') || 0;
    var max = $element.attr('max') || 100;
    
    var value = ($element.val() - min) / (max - min);  
    
    $element.css('background',
                '-webkit-linear-gradient(left, ' + thumbColor + ' 0%, '+ 
                thumbColor + ' ' + value*100 + '%, ' + 
                trackColor + ' ' + value*100 + '%, ' + trackColor + ' 100%)');   
  }
  
})($);

