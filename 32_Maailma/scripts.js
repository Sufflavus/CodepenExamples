(function($, google) {
  let $window = $(window);
  let $inputSearch = $("#input_search");
  let $btnSearch = $("#btn_search");
  let $btnClean = $("#btn_clean");
  let $resultWrapper = $("#result_wrapper");
  let $resultText = $("#result_text");
  let $resultLinkWrapper = $("#result_link_wrapper");
  let $resultLink = $("#result_link");
  let $resultMap = $("#result_map");
  
  let geocoder = new google.maps.Geocoder();
  let zoom = 5;
  let map;
  let marker; 
  
  const EnterCode = 13;
  const ErrorClassName = "result__text_error";
  
  init();
  
  function init() {
    let somePoint = {lat: -25.363, lng: 131.044};
    let link = createLink(somePoint);
    
    setMapHeight();
    initMap(somePoint);   
    
    $resultText.text(pointToString(somePoint));
    $resultLink.attr("href", link).text(link);
    $resultText.show();
    $resultLinkWrapper.show();
    
    $window.resize(setMapHeight);  
    $inputSearch.keyup(onInputSearchKeyup);  
    $btnSearch.click(search);  
    $btnClean.click(clean);
  }   
  
  function initMap(somePoint) {
    map = new google.maps.Map($resultMap[0], {
      zoom: zoom,
      center: somePoint
    });
    
    marker = new google.maps.Marker({
      map: map,
      position: somePoint
    });   
  }
  
  function onInputSearchKeyup(event) {
    if(event.keyCode == EnterCode){
      $btnSearch.click();
    }
  }
  
  function search() {
    if(!$inputSearch[0].value) {
      return;
    }
    
    $resultText.hide();
    $resultLinkWrapper.hide();
    $resultMap.hide();
    geocoder.geocode({ "address": $inputSearch[0].value}, geocodeCallBack);
  }
  
  function clean() {
    $inputSearch[0].value = "";
    $resultText.hide();
    $resultLinkWrapper.hide();
    $resultMap.hide();
    $resultText.removeClass(ErrorClassName);
    $resultText.value = "";
    marker.setMap(null);
  }
  
  function setMapHeight() {
    $resultMap.height($resultMap.width());
  }
  
  function geocodeCallBack(results, status) {
    if (status === "OK") {
      let location = results[0].geometry.location;
      showSuccessfulSearchResult(location);
      return;
    }
    
    showFailedSearchResult(status);
  }
  
  function showSuccessfulSearchResult(location) {
    let point = {
      lat: location.lat(), 
      lng: location.lng()
    };

    let link = createLink(point);
    
    map.setCenter(location);
    marker.setMap(map);
    marker.setPosition(location);
    $resultText.removeClass(ErrorClassName);
    $resultText.text(pointToString(point));
    $resultLink.attr("href", link).text(link);
    $resultText.show();
    $resultLinkWrapper.show();
    $resultMap.show();
  }
  
  function pointToString(location) {
    return `lat: ${location.lat}, lng: ${location.lng}`;
  }
  
  function createLink(location) {
    return `https://maps.google.com/?z=${zoom}&q=${location.lat},${location.lng}`;
  }
  
  function showFailedSearchResult(error) {
    $resultText.addClass(ErrorClassName);
    $resultText.text(`The search was not successful because of the following reason: ${error}`);
    $resultText.show();
    $resultLink.hide();
    marker.setMap(null);
  }
})($, google);

// https://stackoverflow.com/questions/6582834/use-a-url-to-link-to-a-google-map-with-a-marker-on-it