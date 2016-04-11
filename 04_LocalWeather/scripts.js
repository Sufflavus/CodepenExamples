(function() {
  var tempUnits = {
    fahrenheit: "F",
    celsius: "C"
  };
  
  var localWeather = {};
  
  showLocalWeather();
  bindClickButtonEvent();
  
  function showLocalWeather() {
    $.getJSON("http://ipinfo.io/json").then(function(ipInfo) {          
      var location = getLocation(ipInfo);
      $("#location").text(location.city + ", " + location.country);   
      var getWeatherUrl = createGetWeatherUrl(location.latitude, location.longitude);      
      return $.getJSON(getWeatherUrl);
    }).then(function(weatherInfo){      
      var weather = getWeather(weatherInfo);
      $("#img_condition").attr("src", weather.icon);
      $("#description").text(weather.description);
      $("#temperature").text(roundTemp(weather.temp) + " " + weather.units);
      localWeather = weather;
    });
  }  
  
  function bindClickButtonEvent() {
    $("#btnChangeUnits").click(function() {
      var $button = $(this);
      if(localWeather.units === tempUnits.fahrenheit) {
        localWeather.temp = convertFahrenheitToCelsius(localWeather.temp);
        localWeather.units = tempUnits.celsius;
        $button.text("C >> F");
      } else {
        localWeather.temp = convertCelsiusToFahrenheit(localWeather.temp);
        localWeather.units = tempUnits.fahrenheit;
        $button.text("F >> C");
      }
      $("#temperature").text(roundTemp(localWeather.temp) + " " + localWeather.units);
    }); 
  }    
  
  function createGetWeatherUrl(latitude, longitude) {
    return "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=8a8d136ffe83a12dbbfe14d5fc9a3964";
  }
  
  function getLocation(ipInfo) {
    var location = ipInfo.loc.split(",");    
    return {
      latitude: location[0],
      longitude: location[1],
      country: ipInfo.country,
      city: ipInfo.city      
    };
  }
  
  function getWeather(weatherInfo) {
    var icon = weatherInfo.weather[0].icon;
    return {
      icon: "http://openweathermap.org/img/w/" + icon + ".png",
      temp: weatherInfo.main.temp,
      units: tempUnits.fahrenheit,
      description: weatherInfo.weather[0].description,
    };
  }
  
  function roundTemp(temp) {
    return Math.round(temp);
  }  
          
  function convertFahrenheitToCelsius(value) {
    return (value - 32)/1.8;
  }
  
  function convertCelsiusToFahrenheit(value) {
    return value * 1.8 + 32;
  }
})();