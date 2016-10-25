(function() {
  var tempUnits = {
    fahrenheit: "F",
    celsius: "C"
  };
  
  var localWeather = {};
    
  showLocalWeather();
  bindClickButtonEvent();
  
  function showLocalWeather() {
    $.getJSON("//ipinfo.io/json").then(function(ipInfo) {       
      var location = getLocation(ipInfo);
      $("#location").text(location.city + ", " + location.country);   
      var getWeatherUrl = createGetWeatherUrl(location.latitude, location.longitude);   
      
      return $.ajax({
        url: getWeatherUrl,
        dataType: "jsonp"
      });      
    }).then(function(weatherInfo) {   
      console.log(weatherInfo)
      var weather = getWeather(weatherInfo);
      localWeather = weather;
      
      var skycons = new Skycons({"color": "white"});
      skycons.add(document.getElementById("img_condition"), weather.icon);
      skycons.play();
      
      $("#description").text(weather.description);
      $("#temperature").text(roundTemp(weather.temp) + " " + weather.units);            
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
    return "//api.darksky.net/forecast/8007dc52232ebc5f498c70b6ffe19da6/" + latitude + "," + longitude + "?units=si";    
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
    return {
      icon: weatherInfo.currently.icon,
      temp: convertCelsiusToFahrenheit(weatherInfo.currently.temperature),
      units: tempUnits.fahrenheit,
      description: weatherInfo.currently.summary,
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