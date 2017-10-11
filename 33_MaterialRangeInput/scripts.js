(function($) {
  var $range = $('input[type="range"]');
  var trackColor = "#b5b5b6";
  var thumbColor = "#ef6c00";
  var zeroClassName = "zero";
  var isWebkit = 'WebkitAppearance' in document.documentElement.style;
  
  $.each($range, function(k, v) {
    setRangeColor($(v));
  });

  $range.change(function() {
    var $this = $(this);
    setRangeColor($this);
  });  

  function setRangeColor($element) {    
    var value = getValue($element);
    
    if(value == 0) {
      $element.addClass(zeroClassName);
    } else {
      $element.removeClass(zeroClassName);
    }
    
    var isDisabled = $element.attr("disabled");
    
    if(isDisabled) {
      return;
    }

    if(isWebkit) {
      $element.css("background", getTrackBackground(value));
    }    
  }
  
  function getValue($element) {
    var min = $element.attr("min") || 0;
    var max = $element.attr("max") || 100;
    return ($element.val() - min) / (max - min);
  }
  
  function getTrackBackground(value) {
    return `-webkit-linear-gradient(left, ${thumbColor} 0%, ${thumbColor} ${value * 100}%, ${trackColor} ${value * 100}%, ${trackColor} 100%)`;
  }
})($);
