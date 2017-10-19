(function($) {
  var $range = $('input[type="range"]');
  var trackColor = "#9E9E9E";
  var trackOffColor = "#B6B6B6";
  var trackOffFocusedColor = "#9A9A9A";
  var thumbColor = "#FF9800";
  var zeroClassName = "off";
  var isWebkit = 'WebkitAppearance' in document.documentElement.style;
  
  $.each($range, function(k, v) {
    setRangeColor($(v));
  });

  $range.change(function() {
    var $this = $(this);
    setRangeColor($this);
  });  
  
  $range.blur(function() {
    var $this = $(this);
    setRangeColor($this);
  });
  
  $range.click(function() {
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
    
    var isFocused= $element.is(':focus');
    console.log(isFocused);

    if(isWebkit) {
      $element.css("background", getTrackBackground(value, isFocused));
    }    
  }
  
  function getValue($element) {
    var min = $element.attr("min") || 0;
    var max = $element.attr("max") || 100;
    return ($element.val() - min) / (max - min);
  }
  
  function getTrackBackground(value, isFocused) {
    let trackBg = getTrackColor(value, isFocused);
    return `-webkit-linear-gradient(left, ${thumbColor} 0%, ${thumbColor} ${value * 100}%, ${trackBg} ${value * 100}%, ${trackBg} 100%)`;
  }
  
  function getTrackColor(value, isFocused) {
    if(value == 0 && isFocused) {
      return trackOffFocusedColor;
    }      
    
    return value > 0 ? trackColor : trackOffColor;
  }
})($);
