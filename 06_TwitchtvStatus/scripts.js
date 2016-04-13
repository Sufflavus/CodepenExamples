(function() {
  var userNames = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff", "brunofin", "OgamingSC2"];
  var usersUrl = "https://api.twitch.tv/kraken/users/";
  var streamsUrl = "https://api.twitch.tv/kraken/streams/";
  var dummyImg = "http://dummyimage.com/50x50/bdbdbd/ffffff.png&text=0x3F";
    
  var $users = $("#users");
  var allUserSections = [];
  var onlineUserSections = [];
  var offlineUserSections = [];
    
  initData();
  subscribeTabs();
    
  function initData() {
    userNames.forEach(function(name) {
      var user = {};      
      
      $.getJSON(usersUrl + name)
        .then(function(data) {
          user.name = data.display_name;
          user.logo = data.logo || dummyImg;
          user.url = "http://twitch.tv/" + data.name;        
      });
      
      $.getJSON(streamsUrl + name)
        .then(function(data) {          
          if(data.stream) {            
            user.message = data.stream.game + ": " + data.stream.channel.status;
            createOnlineUserSection(user);
          } else {
            createOfflineUserSection(user);
          }            
        }).fail(function(a, b, c) {
          createClosedUserSection(user);
      });      
    })
  }
  
  function subscribeTabs() {
    $("#tab_all").click(function() {
      allUserSections.forEach(function(section) {
        section.fadeIn(2000); 
      });        
    });
    
    $("#tab_online").click(function() {
      onlineUserSections.forEach(function(section) {
        section.fadeIn(); 
      }); 
      offlineUserSections.forEach(function(section) {
        section.fadeOut(); 
      });             
    });
    
    $("#tab_offline").click(function() {
      onlineUserSections.forEach(function(section) {
        section.fadeOut(); 
      });  
      offlineUserSections.forEach(function(section) {
        section.fadeIn(); 
      });              
    });
  }
    
  function createOnlineUserSection(user) {    
    var section = $("<li/>", {        
      class: "collection-item avatar invisible"
    }).appendTo($users);

    var logo = $("<img/>", {
      src: user.logo,
      class: "circle"
    }).appendTo(section);
    
    var link = $("<a/>", {
      class: "title teal-text text-lighten-1",
      text: user.name,
      href: user.url,
      target: "_blank"
    }).appendTo(section);
    
    var message = $("<p/>", {
      text: user.message,
      class: "grey-text truncate"
    }).appendTo(section);

    var statusContainer = $("<span/>", {
      class: "secondary-content",
      title: "Online"
    }).appendTo(section);

    var icon = $("<i/>", {
      class: "material-icons",
      text: "done"
    }).appendTo(statusContainer);

    section.fadeIn(2000);  
    
    allUserSections.push(section);
    onlineUserSections.push(section);
  }
  
  function createOfflineUserSection(user) {    
    var section = $("<li/>", {        
      class: "collection-item avatar invisible"
    }).appendTo($users);

    var logo = $("<img/>", {
      src: user.logo,
      class: "circle"
    }).appendTo(section);
    
    var link = $("<a/>", {
      class: "title pink-text text-lighten-2",
      text: user.name,
      href: user.url,
      target: "_blank"
    }).appendTo(section);

    var statusContainer = $("<span/>", {
      class: "secondary-content pink-text text-lighten-2",
      title: "Offline"
    }).appendTo(section);

    var icon = $("<i/>", {
      class: "material-icons",
      text: "error_outline"
    }).appendTo(statusContainer);

    section.fadeIn(2000); 
    
    allUserSections.push(section);
    offlineUserSections.push(section);
  }
  
  function createClosedUserSection(user) {        
    var section = $("<li/>", {        
      class: "collection-item avatar invisible"
    }).appendTo($users);

    var logo = $("<img/>", {
      src: user.logo,
      class: "circle"
    }).appendTo(section);
    
    var link = $("<a/>", {
      class: "title pink-text text-lighten-2",
      text: user.name,
      href: user.url,
      target: "_blank"
    }).appendTo(section);

    var statusContainer = $("<span/>", {
      class: "secondary-content pink-text text-lighten-2",
      title: "Account Closed"
    }).appendTo(section);

    var icon = $("<i/>", {
      class: "material-icons",
      text: "not_interested"
    }).appendTo(statusContainer);

    section.fadeIn(2000);   
    
    allUserSections.push(section);
    offlineUserSections.push(section);
  }
})();