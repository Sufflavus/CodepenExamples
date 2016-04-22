(function() {
  var sessionLingth = 25;
  var breakLength = 5;
  
  var $breakTime = $("#breakTime");
  var $sessionTime = $("#sessionTime");
  var $timeLeft = $("#timeLeft");
  var $btnPlay = $("#btnPlay");
  var $btnPause = $("#btnPause");
  
  var timer;
  var currentDuration;
    
  $("#btnDecreaseBreak").click(function() {
    if(breakLength > 1) {
      breakLength--;
      $breakTime.text(breakLength);
    }
  });
  
  $("#btnIncreaseBreak").click(function() {
    breakLength++;
    $breakTime.text(breakLength);
  });
  
  $("#btnDecreaseSession").click(function() {
    if(sessionLingth > 1) {
      sessionLingth--;
      $sessionTime.text(sessionLingth);
      $timeLeft.text(sessionLingth + ":00");
      //moment("123", "mm").format("mm:ss")
    }
  });
  
  $("#btnIncreaseSession").click(function() {
    sessionLingth++;
    $sessionTime.text(sessionLingth);
    $timeLeft.text(sessionLingth + ":00");
  });
  
  $btnPlay.click(function() {
    $btnPlay.hide();
    $btnPause.show();
    currentDuration = moment.duration("00:" + $timeLeft.text());
    timer = setInterval(onTimerTick, 1000);
  });
  
  $btnPause.click(function() {
    $btnPause.hide();
    $btnPlay.show();
    clearInterval(timer);
  });
  
  function onTimerTick() {
    if(currentDuration.asSeconds() > 0) {
      currentDuration.add(-1, "s");
      $timeLeft.text(currentDuration.minutes() + ":" + currentDuration.seconds());
    } else {
      clearInterval(timer);
    }   
  }
  
  //setTimeout(arguments.callee, 60000);
})();