(function() {   
  var $breakLength = $("#breakLength");
  var $sessionLength = $("#sessionLength");
  var $timeLeft = $("#timeLeft");
  var $circle = $("#circle");
  var $btnPlay = $("#btnPlay");
  var $btnPause = $("#btnPause");
  var $sessionLabel = $("#sessionLabel");
  var $breakLabel = $("#breakLabel");
  var $progressBar = $("#progressBar");
  
  var sessionEndAudio = new Audio("http://www.oringz.com/oringz-uploads/sounds-928-gentle-alarm.mp3");
  
  var breakEndAudio = new Audio("http://www.oringz.com/oringz-uploads/sounds-882-solemn.mp3");
    
  var timer;
       
  var engine = new PomodoroEngine();
  
  $breakLength.text(engine.getBreakLength()); 
  $sessionLength.text(engine.getSessionLength()); 
  $timeLeft.text(engine.getFormattedLeftTime());
      
  $("#btnDecreaseBreak").click(function() {
    stopTimer();
    engine.decreaseBreak();
    $breakLength.text(engine.getBreakLength()); 
    $timeLeft.text(engine.getFormattedLeftTime());
    updateProgress();
  });
     
  $("#btnIncreaseBreak").click(function() {
    stopTimer();
    engine.increaseBreak();
    $breakLength.text(engine.getBreakLength());
    $timeLeft.text(engine.getFormattedLeftTime());
    updateProgress();
  });
  
  $("#btnDecreaseSession").click(function() {
    stopTimer();    
    engine.decreaseSession();
    $sessionLength.text(engine.getSessionLength()); 
    $timeLeft.text(engine.getFormattedLeftTime());
    updateProgress();
  });
  
  $("#btnIncreaseSession").click(function() {
    stopTimer();
    engine.increaseSession();
    $sessionLength.text(engine.getSessionLength()); 
    $timeLeft.text(engine.getFormattedLeftTime());
    updateProgress();
  });
  
  function stopTimer() {    
    if(engine.isPlaying()) {
      $btnPause.click();
    }
  }
  
  $btnPlay.click(function() {           
    $btnPlay.toggle();
    $btnPause.toggle();
    engine.play();
    timer = setInterval(onTimerTick, 1000);
  });
  
  $btnPause.click(function() {    
    $btnPause.toggle();
    $btnPlay.toggle();
    engine.pause();
    clearInterval(timer);
  });
  
  function onTimerTick() {
    if(engine.getLeftTimeInSeconds() == 0) {
      if(engine.isSessionInProgress()) {
        sessionEndAudio.play();        
      } else if(engine.isBreakInProgress()){
        breakEndAudio.play();        
      } 
      
      $sessionLabel.toggle();
      $breakLabel.toggle();
      $circle.toggleClass("circle-break").toggleClass("circle-session");
    }
    
    engine.tick();
    $timeLeft.text(engine.getFormattedLeftTime());
    updateProgress();    
  }
  
  function updateProgress() {
    var leftPercents = engine.getLeftTimeInPercents();
    $progressBar.width(leftPercents + "%");
  }
    
  function PomodoroEngine() {
    var self = this;
    
    var sessionLength = 25;
    var breakLength = 5;
    
    var timerType = {
      none: 0,
      session: 1,
      break: 2
    };
    
    var currentTimerType = timerType.none;
    var isPaused = false;
    
    var leftTime = getDuration(sessionLength);
           
    function getDuration(minutes) {
      return moment.duration("00:" + minutes + ":00");
    }
    
    self.isPlaying = function() {
      return !isPaused;
    };
    
    self.isSessionInProgress = function() {
      return currentTimerType === timerType.session;
    };
    
    self.isBreakInProgress = function() {
      return currentTimerType === timerType.break;
    };
    
    self.decreaseBreak = function() {
      if(breakLength > 1) {
        breakLength--;
      }  
      
      if(currentTimerType === timerType.break) {
        leftTime = getDuration(breakLength);
      }
    };
    
    self.increaseBreak = function() {
      breakLength++;
      
      if(currentTimerType === timerType.break) {
        leftTime = getDuration(breakLength);
      }
    };  
    
    self.decreaseSession = function () {
      if(sessionLength > 1) {
        sessionLength--;
      }  
      
      if(currentTimerType !== timerType.break) {
        leftTime = getDuration(sessionLength);
      }
    };
    
    self.increaseSession = function() {
      sessionLength++;
      
      if(currentTimerType !== timerType.break) {
        leftTime = getDuration(sessionLength);
      }
    };
    
    self.getBreakLength = function() {
      return breakLength;
    };
    
    self.getSessionLength = function() {
      return sessionLength;
    };
    
    self.getLeftTimeInSeconds = function() {
      return leftTime.asSeconds();
    };
    
    self.getLeftTimeInPercents = function() {
      var leftSeconds = leftTime.asSeconds();      
      
      if(currentTimerType === timerType.session) {
        return Math.round(leftSeconds*100 / (sessionLength*60));
      }
      
      if(currentTimerType === timerType.break) {
        return Math.round(leftSeconds*100 / (breakLength*60));
      }
      
      return 100;
    };
    
    self.getFormattedLeftTime = function() {
      var min = leftTime.minutes();
      var sec = leftTime.seconds();
      return (min >= 10 ? "" : "0") + min + ":" + (sec >= 10 ? "" : "0") + sec;
    };
    
    self.play = function() {
      if(currentTimerType === timerType.none) {
        currentTimerType = timerType.session;
      }
      isPaused = false;     
    };
    
    self.pause = function() {
      isPaused = true;
    }; 
    
    self.tick = function() {
      if(leftTime.asSeconds() > 0) {
        leftTime.add(-1, "s");        
        return;
      }       

      if(currentTimerType === timerType.session) {
        leftTime = getDuration(breakLength);         
        currentTimerType = timerType.break;
      } else {
        leftTime = getDuration(sessionLength);         
        currentTimerType = timerType.session;
      } 
    };
  }
})();