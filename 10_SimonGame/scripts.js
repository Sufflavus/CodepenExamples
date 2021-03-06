(function() {
  //http://www.grsites.com/archive/sounds/category/23/?offset=12
  var $btnStrict = $("#btnStrict");
  var $score = $("#score");
  var $switchCheckbox = $("#switchCheckbox");
  var $btnStart = $("#btnStart");
  var $segments = $(".segment");
  
  var game = new Game();
    
  var errorAudio = new Audio("//static1.grsites.com/archive/sounds/cartoon/cartoon004.mp3");
  var winAudio = new Audio("//static1.grsites.com/archive/sounds/musical/musical097.mp3");  
  
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
    red: new Audio("//s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    blue: new Audio("//s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    yellow: new Audio("//s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    green: new Audio("//s3.amazonaws.com/freecodecamp/simonSound4.mp3")
  };
  
  var segmentHighlightClass = {
    red: "accent-2",
    blue: "accent-1",
    yellow: "accent-2",
    green: "accent-3"
  };
  
  initSegments();
  initSegmentAudios();
  
  winAudio.onplay = function() {
    $segments.removeClass("clickable");  
    $score.text("***");
  };
  
  winAudio.onended = game.restart;
  
  $btnStart.click(function() {   
    game.restart();        
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
          if($segments.hasClass("clickable")) {
            game.onUserMove(colorName);
          }          
        };        
      } (key, $segment));
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
    var initialDelay = 1000;
    var delay = initialDelay;
    var minNumber = 0;
    var maxNumber = 3;
    var strangerSequence = [];
    var winScore = 20;
    var increaseScores = [5, 9, 13];
    var delayDecrement = 200;
    var waitingTimeout;
        
    var players = {
      ai: "ai",
      stranger: "stranger"
    };
    
    var activePlayer = players.ai;
        
    function toggleStrict() {
      isStrict = !isStrict;
    }
            
    function restart() {
      removeWaitingTimeout();
      activePlayer = players.ai;
      score = 0;      
      sequence = [];
      delay = initialDelay;          
      
      increaseSequence();
      showScore();
      play();
    }
    
    function turnOff() {
      removeWaitingTimeout();
      activePlayer = players.ai;
      $segments.removeClass("clickable");  
      score = 0;
      delay = initialDelay;
      isStrict = false;
      sequence = [];      
    }
    
    function play() {   
      activePlayer = players.ai;
      $segments.removeClass("clickable");      
      var index = 0;
      var color = sequence[index];
      
      setTimeout(function() { 
        playAudio(color, index);          
      }, delay); 
      
      function playAudio(name, index) {            
        var audio = segmentAudio[name];    
        
        if(!audio) {
          return;
        }
        
        audio.addEventListener('ended', onAudioEnd);
        audio.play();
        
        function onAudioEnd() {  
          audio.removeEventListener('ended', onAudioEnd);

          if(index == sequence.length - 1) {
            $segments.addClass("clickable");
            activePlayer = players.stranger;
            strangerSequence = sequence.slice();
            setWaitingTimeout();
            return;
          }

          var nextColor = sequence[index + 1];
          setTimeout(function() { 
            playAudio(nextColor, index + 1);          
          }, delay); 
        }     
      }           
    }
    
    function setWaitingTimeout() {
      waitingTimeout = setTimeout(function() { 
        errorAudio.play();
        activePlayer = players.ai;    
        $segments.removeClass("clickable");
        if(isStrict) {            
          setTimeout(restart, delay);
        } else {
          setTimeout(play, delay);
        } 
      }, delay*4); 
    }
    
    function removeWaitingTimeout() {
        clearTimeout(waitingTimeout);
    }
    
    function onUserMove(colorName) {        
      if(activePlayer === players.stranger) {
        removeWaitingTimeout();
        var expected = strangerSequence.shift();        
        if(expected === colorName) {
          segmentAudio[colorName].play();    
        } else {           
          activePlayer = players.ai;    
          $segments.removeClass("clickable");
          errorAudio.play();
          if(isStrict) {            
            setTimeout(restart, delay);
          } else {
            setTimeout(play, delay);
          } 
          return;
        }
        
        if(!strangerSequence.length) {
          if(score == winScore) {
            activePlayer = players.ai;
            winAudio.play();
            return;
          }
          activePlayer = players.ai;
          increaseSequence();
          showScore();
          setTimeout(play, delay);           
        } else {
          setWaitingTimeout();
        }
      }      
    }
    
    function increaseSequence() {
      score++;
      var nextColor = getNextColor();      
      sequence.push(nextColor);     
      if(increaseScores.indexOf(score) >=0) {
        delay -= delayDecrement;
      }
    }
    
    function getNextColor() {      
      var number = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      return segmentName[number];
    }
    
    function showScore() {
      $score.text(score >= 10 ? score : "0" + score); 
    }
    
    return {
      restart: restart,
      onUserMove: onUserMove,      
      toggleStrict: toggleStrict,
      turnOff: turnOff
    };
  }
})();