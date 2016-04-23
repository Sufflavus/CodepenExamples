(function() {
    var sessionLength = 25;
  var breakLength = 5;
  
  var $breakTime = $("#breakTime");
  var $sessionTime = $("#sessionTime");
  var $timeLeft = $("#timeLeft");
  var $btnPlay = $("#btnPlay");
  var $btnPause = $("#btnPause");
  var $sessionLabel = $("#sessionLabel");
  var $breakLabel = $("#breakLabel");
  var $progressBar = $("#progressBar");
  
  var sessionEndAudio = new Audio("http://www.oringz.com/oringz-uploads/sounds-882-solemn.mp3");
  
  var breakEndAudio = new Audio("http://oringz.com/oringz-uploads/sounds-1074-professionals.mp3");
  
  var timer;
  var currentDuration;
  
  var timerType = {
    none: 0,
    session: 1,
    break: 2
  };
  
  var currentTimerType = timerType.none;
  var previousTimerType = timerType.none;
    
  $("#btnDecreaseBreak").click(function() {
    stopTimer();
    if(breakLength > 1) {
      breakLength--;
      $breakTime.text(breakLength);
    }
  });
     
  $("#btnIncreaseBreak").click(function() {
    stopTimer();
    breakLength++;
    $breakTime.text(breakLength);
  });
  
  $("#btnDecreaseSession").click(function() {
    stopTimer();
    if(sessionLength > 1) {
      sessionLength--;
      $sessionTime.text(sessionLength);
      $timeLeft.text((sessionLength >= 10 ? "" : "0") + sessionLength + ":00");      
    }
  });
  
  $("#btnIncreaseSession").click(function() {
    stopTimer();
    sessionLength++;
    $sessionTime.text(sessionLength);
    $timeLeft.text((sessionLength >= 10 ? "" : "0") + sessionLength + ":00");
  });
  
  function stopTimer() {    
    if(currentTimerType != timerType.none) {
      $btnPause.click();
    }
  }
  
  $btnPlay.click(function() {    
    currentTimerType = previousTimerType == timerType.break ? 
      timerType.break : timerType.session;
    
    $btnPlay.hide();
    $btnPause.show();
    
    currentDuration = moment.duration("00:" + $timeLeft.text());
    timer = setInterval(onTimerTick, 1000);
  });
  
  $btnPause.click(function() {
    previousTimerType = currentTimerType;
    currentTimerType = timerType.none;
    $btnPause.hide();
    $btnPlay.show();
    clearInterval(timer);
  });
  
  function onTimerTick() {
    if(currentDuration.asSeconds() > 0) {
      currentDuration.add(-1, "s");
      var min = currentDuration.minutes();
      var sec = currentDuration.seconds();
      $timeLeft.text((min >= 10 ? "" : "0") + min + ":" + (sec >= 10 ? "" : "0") + sec);
      updateProgress();
      return;
    } 
    
    if(currentDuration.asSeconds() == 0) {
      if(currentTimerType == timerType.session) {
        sessionEndAudio.play();
      } else {
        breakEndAudio.play();
      }
      
      //return;
    }
    
    if(currentTimerType == timerType.session) {
      $sessionLabel.hide();
      $breakLabel.show();
      $timeLeft.text(breakLength + ":00");  
      currentTimerType = timerType.break;
    } else {
      $sessionLabel.show();
      $breakLabel.hide();
      $timeLeft.text(sessionLength + ":00");  
      currentTimerType = timerType.session;
    }
    
    currentDuration = moment.duration("00:" + $timeLeft.text());    
    updateProgress();
  }
  
  function updateProgress() {
    var leftPercents = getLeftTimeInPercents();
    $progressBar.width(leftPercents + "%");
  }
  
  function getLeftTimeInPercents() {
    var leftSeconds = currentDuration.asSeconds();

    if(currentTimerType == timerType.session) {
      return Math.round(leftSeconds*100 / (sessionLength*60));
    }

    if(currentTimerType == timerType.break) {
      return Math.round(leftSeconds*100 / (breakLength*60));
    }

    return 100;
  }
})();