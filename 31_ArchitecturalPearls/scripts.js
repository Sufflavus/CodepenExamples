(function initMap(google, MarkerClusterer) {  
  let dataPath = "//cdn.rawgit.com/Sufflavus/CodepenExamples/master/31_ArchitecturalPearls/buildingsGeodata.json";
  let imagesPath = "//cdn.rawgit.com/Sufflavus/CodepenExamples/master/31_ArchitecturalPearls/vendor/google_maps/images/m";
  
  let infoWindow = new google.maps.InfoWindow();
  let map;
  
  init();
  
  function init() {
    let centerPoint = {lat: 60.2049773, lng: 24.9612825};
    
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: centerPoint
    });
    
    map.data.loadGeoJson(dataPath, null, onDataLoaded);    
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});    
  }
  
  function onDataLoaded(features) {
    let markers = features.map(createMarker);
    let markerCluster = new MarkerClusterer(map, markers, {imagePath: imagesPath});
    map.data.setStyle(function (feature) {
      return { icon: feature.getProperty("icon"), visible: false };
    });
  }
  
  function createMarker(feature) {
    let g = feature.getGeometry();
    let marker = new google.maps.Marker({ 
      position: g.get(0),
      map: map
    });
    google.maps.event.addListener(marker, "click", function(e) {
      onMarkerClick(feature);
    });
    return marker;
  }
  
  function onMarkerClick(feature) {
    const position = feature.getGeometry().get();
    let content = buildInfoWindowContent(feature);

    infoWindow.setContent(content);
    infoWindow.setPosition(position);
    infoWindow.open(map);
    
    google.maps.event.addListener(map, "click", function() {
      infoWindow.close();
    });
  }
  
  function buildInfoWindowContent(pointData) {
    const name = pointData.getProperty('name');
    const address = pointData.getProperty('address');    
    const architect = pointData.getProperty('architect');
    const year = pointData.getProperty('year');
    const imageUrl = pointData.getProperty('imageUrl');
    const imageCopyright = pointData.getProperty('imageCopyright');
    const link = pointData.getProperty('link');
    let content = sanitizeHTML`      
      <div class="info-window">
        <div class="info-window__header">${name}</div> 
        <div class="info-window__image-wrapper">
          <img class="info-window__image" src="${imageUrl}"/>
          <div class="info-window__image_info">${imageCopyright}</div>   
        </div>        
        <div class="info-window__content">
          <div class="info-window__row">
            <span class="info-window__label">Address:</span>&nbsp;${address}
          </div>
          <div class="info-window__row">
            <span class="info-window__label">Architect:</span>&nbsp;${architect}
          </div>
          <div class="info-window__row">
            <span class="info-window__label">Year:</span>&nbsp;${year}
          </div>
          <div class="info-window__row">
            <span class="info-window__label">More info:</span>&nbsp;
            <a href="${link}" target="_blank">link</a>
          </div> 
        </div>
      </div>
    `;
    return content;
  }
  
  // Escapes HTML characters in a template literal string, to prevent XSS.
  function sanitizeHTML(strings) {
    const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
    let result = strings[0];
    for (let i = 1; i < arguments.length; i++) {
      result += String(arguments[i]).replace(/[&<>'"]/g, (char) => entities[char]);
      result += strings[i];
    }
    return result;
  }
    

})(google, MarkerClusterer);