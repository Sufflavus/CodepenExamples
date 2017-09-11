(function initMap(google) {    
  let infoWindow = new google.maps.InfoWindow();
  let map;
  
  init();
  
  function init() {
    let centerPoint = {lat: 60.2049773, lng: 24.9612825};
    
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: centerPoint
    });
    
    map.data.loadGeoJson("//raw.githubusercontent.com/Sufflavus/CodepenExamples/master/buildingsGeodata.json", 
                         null, function(features) {
      var markers = features.map(function (feature) {
        var g = feature.getGeometry();
        var marker = new google.maps.Marker({ 'position': g.get(0) });
        return marker;
      });

      var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    });    
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
    map.data.addListener('click', onMarkerClick);
  }
  
  function onMarkerClick(event) {
    const position = event.feature.getGeometry().get();
    let content = buildInfoWindowContent(event.feature);

    infoWindow.setContent(content);
    infoWindow.setPosition(position);
    infoWindow.open(map);
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
            <a href="${link}">link</a>
          </div> 
        </div>
      </div>
    `;
    return content;
  }
  
  // Escapes HTML characters in a template literal string, to prevent XSS.
  // See https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
  function sanitizeHTML(strings) {
    const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
    let result = strings[0];
    for (let i = 1; i < arguments.length; i++) {
      result += String(arguments[i]).replace(/[&<>'"]/g, (char) => {
        return entities[char];
      });
      result += strings[i];
    }
    return result;
  }
    
  //https://developers.google.com/maps/solutions/store-locator/simple-store-locator
  // http://www.ark-l-m.fi/projects/current-projects/
})(google);