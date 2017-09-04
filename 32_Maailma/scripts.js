(function($, google) {
  let $inputSearch = $("#input_search");
  let $btnSearch = $("#btn_search");
  let $btnClean = $("#btn_clean");
  let $resultWrapper = $("#result_wrapper");
  let $resultText = $("#result_text");
  let $resultMap = $("#result_map");
  
  const EnterCode = 13;
  
  $resultMap.height($resultMap.width());
  
  let geocoder = new google.maps.Geocoder();
  
  var uluru = {lat: -25.363, lng: 131.044};
  let map = new google.maps.Map(document.getElementById('result_map'), {
    zoom: 4,
    center: uluru
  });
  let marker = new google.maps.Marker({
    map: map,
    position: uluru
  });
  
  $(window).resize(function() {
    $resultMap.height($resultMap.width());
  });
  
  $inputSearch.keyup(function(event){
    if(event.keyCode == EnterCode){
      $btnSearch.click();
    }
  });
  
  $btnSearch.click(() => {    
    if(!!$inputSearch[0].value) {
      $resultText.hide();
      $resultMap.hide();
      geocoder.geocode({ "address": $inputSearch[0].value}, geocodeCallBack);
    }
  });
  
  $btnClean.click(() => {    
    $inputSearch[0].value = "";
    $resultText.hide();
    $resultMap.hide();
    $resultText.removeClass("result__text_error");
    $resultText.value = "";
    marker.setMap(null);
  });
  
  function geocodeCallBack(results, status) {
    if (status == 'OK') {
      let location = results[0].geometry.location;
      map.setCenter(location);
      marker.setMap(map);
      marker.setPosition(location);
      $resultText.removeClass("result__text_error");
      $resultText.value = location;
      $resultText.show();
      $resultMap.show();
    } else {
      $resultText.addClass("result__text_error");
      $resultText.value = "The search was not successful because of the following reason: " + status;
      $resultText.show();
      marker.setMap(null);
    }
  }
})($, google);