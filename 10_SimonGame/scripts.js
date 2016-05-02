(function() {
  var $btnStrict = $("#btnStrict");
  var $score = $("#score");
  var $switchCheckbox = $("#switchCheckbox");
  var $btnStart = $("#btnStart");
  
  var game = new Game();  
    
  var errorAudio = new Audio("http://www.oringz.com/oringz-uploads/sounds-972-thats-nasty.mp3");
  var winAudio = new Audio("http://www.oringz.com/oringz-uploads/sounds-727-good-morning.mp3");
  
  var segments = {
    red: $("#redSegment"),
    blue: $("#blueSegment"),
    yellow: $("#yellowSegment"),
    green: $("#greenSegment")
  };
  
  var segmentName = {
    0: "red",
    1: "blue",
    2: "yellow",
    3: "green"
  };
  
  var segmentAudio = { 
    red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
  };
  
  var segmentHighlightClass = {
    red: "accent-2",
    blue: "accent-2",
    yellow: "accent-2",
    green: "accent-3"
  };
  
  initSegments();
  initSegmentAudios();
  
  $btnStart.click(function() {   
    game.restart();
    var score = game.getScore();
    $score.text(score >= 10 ? score : "0" + score);    
  });
  
  $btnStrict.click(function() {
    $btnStrict.toggleClass("accent-1");
    game.toggleStrict();
  });
     
  $("#switch").change(function() {     
    if($switchCheckbox.prop("checked") == true) {
      $score.text("__");      
    } else {
      $score.text("");
      $btnStrict.removeClass("accent-1");
      game.turnOff();
    }
        
    $("button").prop("disabled", function(i, v) { return !v; });
  });
  
  function initSegments() {
    for (var key in segments) {
      if (!segments.hasOwnProperty(key)) { 
        continue; 
      }      
      
      var $segment = segments[key];         
      $segment.click(function(colorName) {
        return function() {
          game.onUserMove(colorName);
        };        
      } (key));
    }      
  }
  
  function initSegmentAudios() {
    for (var key in segmentAudio) {
      if (!segmentAudio.hasOwnProperty(key)) { 
        continue; 
      }
      
      var audio = segmentAudio[key];
      var $segment = segments[key];         
      var highlightClass = segmentHighlightClass[key];
            
      audio.onplay = function($segment, highlightClass) {
        return function() {
          $segment.addClass(highlightClass);
        };        
      } ($segment, highlightClass);
      
      audio.addEventListener('ended', function($segment, highlightClass) {
        return function() {
          $segment.removeClass(highlightClass);
        };        
      } ($segment, highlightClass));      
    }
  }
  
  function Game() {
    var sequence = [];
    var isStrict = false;
    var score = 0;
    var delay = 1000;
    var minNumber = 0;
    var maxNumber = 3;
        
    function toggleStrict() {
      isStrict = !isStrict;
    }
    
    function getScore() {
      return score;
    }
    
    function restart() {
      score = 0;
      isStrict = false;
      sequence = [];
      var nextNumber = getNextNumber();      
      sequence.push(nextNumber);
      play();
    }
    
    function turnOff() {
      score = 0;
      isStrict = false;
    }
    
    function play() {   
      $(".segment").prop("disabled", true);
      
      var index = 0;
      var number = sequence[index];
      
      setTimeout(function() { 
        playAudio(number, index);          
      }, delay * index); 
      
      function playAudio(number, index) {
        var name = segmentName[number];
        var audio = segmentAudio[name];        
        audio.play();  
        
        audio.addEventListener('ended', function () {
          if(index == sequence.length - 1) {
            $(".segment").prop("disabled", false);
            return;
          }
          
          var nextNumber = sequence[index + 1];
          setTimeout(function() { 
            playAudio(nextNumber, index + 1);          
          }, delay); 
        });
      }
    }
    
    function onUserMove(colorName) {
      console.log(colorName)
    }
    
    function getNextNumber() {      
      return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    }
    
    return {
      restart: restart,
      onUserMove: onUserMove,
      getScore: getScore,
      toggleStrict: toggleStrict,
      turnOff: turnOff
    };
  }
})();