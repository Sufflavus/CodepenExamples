(function initMap() {
  var geocoder = new google.maps.Geocoder();
  var uluru = {lat: 60.2049773, lng: 24.9612825};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  geocoder.geocode({ 'address': "Suvorovskiy prosp., 4, Vyborg, Leningradskaya oblast', Russia, 188800"}, geocodeCallBack);
  
  function geocodeCallBack(results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  }
  /*var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });*/
})();