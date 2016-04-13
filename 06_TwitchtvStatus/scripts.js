(function() {
  var userNames = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff", "brunofin", "OgamingSC2"];
  
  var usersUrl = "https://api.twitch.tv/kraken/users/";
  var streamsUrl = "https://api.twitch.tv/kraken/streams/";
  var dummyImg = "http://dummyimage.com/50x50/bdbdbd/ffffff.png&text=0x3F";
    
  var $users = $("#users");
  
  var allUserSections = [];
  var onlineUserSections = [];
  var offlineUserSections = [];
  
  var tabs = {
    all: "0",
    online: "1",
    offline: "2"
  };
  
  var selectedTab = tabs.all;
    
  initData();
  subscribeTabs();
  subscribeSearch();
    
  function initData() {
    userNames.forEach(function(name) {
      var user = {};      
      
      $.getJSON(usersUrl + name)
        .then(function(data) {
          user.name = data.display_name;
          user.logo = data.logo || dummyImg;
          user.url = "http://twitch.tv/" + data.name;                  
          return $.getJSON(streamsUrl + name)
        }).then(function(data) {          
            if(data.stream) {            
              user.message = data.stream.game + ": " + data.stream.channel.status;
              showOnlineUserSection(user);
            } else {
              showOfflineUserSection(user);
            }            
          }).fail(function(a, b, c) {
            showClosedUserSection(user);
        });      
    })
  }
  
  function subscribeTabs() {
    $("#tab_all").click(function() {
      allUserSections.forEach(function(section) {
        section.fadeIn(2000); 
      });    
      selectedTab = tabs.all;
    });
    
    $("#tab_online").click(function() {
      onlineUserSections.forEach(function(section) {
        section.fadeIn(); 
      }); 
      offlineUserSections.forEach(function(section) {
        section.fadeOut(); 
      });   
      selectedTab = tabs.online;
    });
    
    $("#tab_offline").click(function() {
      onlineUserSections.forEach(function(section) {
        section.fadeOut(); 
      });  
      offlineUserSections.forEach(function(section) {
        section.fadeIn(); 
      });    
      selectedTab = tabs.offline;
    });
  }
  
  function subscribeSearch() {
    $("#search_field").keyup(function(){
      var filter = $(this).val().toLowerCase();
      var arrayForSearch;
      
      switch(selectedTab) {
        case tabs.online:
          arrayForSearch = onlineUserSections;
          break;
        case tabs.offline:
          arrayForSearch = offlineUserSections;
          break;
        default:
          arrayForSearch = allUserSections;          
      }
      
      arrayForSearch.forEach(function(section) {
        if(section.data("id").indexOf(filter) >= 0) {
          section.fadeIn(); 
        } else {
          section.fadeOut(); 
        }        
      });       
    });
  }
    
  function showOnlineUserSection(user) {    
    var section = $("<li/>", {        
      class: "collection-item avatar invisible",
      "data-id": user.name.toLowerCase()
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
  
  function showOfflineUserSection(user) {    
    var section = $("<li/>", {        
      class: "collection-item avatar invisible",
      "data-id": user.name.toLowerCase()
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
  
  function showClosedUserSection(user) {        
    var section = $("<li/>", {        
      class: "collection-item avatar invisible",
      "data-id": user.name.toLowerCase()
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