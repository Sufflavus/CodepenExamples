(function() {
  // http://forum.freecodecamp.com/t/use-the-twitchtv-json-api/19541
  //
  var userNames = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff", "ESL_SC2", "OgamingSC2", "cretetion", "fakke"];
  
  var usersUrl = "//api.twitch.tv/kraken/users/";
  var streamsUrl = "//api.twitch.tv/kraken/streams/";
  var dummyImg = "http://dummyimage.com/50x50/bdbdbd/ffffff.png&text=0x3F";
  var userProfileUrl = "//twitch.tv/";
    
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
      
      $.when(getUser(name), getStream(name))
        .then(function(usersResult, streamsResult) {
          var userData = usersResult[0];
          var streamData = streamsResult[0].stream;
        
          var user = {
            name: userData.display_name,
            logo: userData.logo || dummyImg,
            url: userProfileUrl + userData.name
          };   
          
          if(streamData) {            
            user.message = streamData.game + ": " + streamData.channel.status;
            initOnlineUserSection(user);
          } else {
            initOfflineUserSection(user);
          }    
        })
        .fail(function(a, b, c) {        
            var user = {
              name: name,
              logo: dummyImg,
              url: userProfileUrl + name
            };            
            initClosedUserSection(user);
        }); 
      
      /* $.getJSON(usersUrl + name + "/?client_id=a59qej09oftmvj165yc0tnhll3sxps")
        .then(function(data) {
          console.log(name + " users: ");
          console.log(data);
          user.name = data.display_name;
          user.logo = data.logo || dummyImg;
          user.url = "http://twitch.tv/" + data.name;                  
          return $.getJSON(streamsUrl + name + "/?client_id=a59qej09oftmvj165yc0tnhll3sxps")
        }).then(function(data) {  
            console.log(name + " streams: ");
            console.log(data);
            if(data.stream) {            
              user.message = data.stream.game + ": " + data.stream.channel.status;
              initOnlineUserSection(user);
            } else {
              initOfflineUserSection(user);
            }            
          }).fail(function(a, b, c) {
            initClosedUserSection(user);
        });  */     
    })
  }
  
  function getUser(userName) {
    return $.getJSON(usersUrl + userName + "/?client_id=a59qej09oftmvj165yc0tnhll3sxps");
  }
  
  function getStream(userName) {
    return $.getJSON(streamsUrl + userName + "/?client_id=a59qej09oftmvj165yc0tnhll3sxps")
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
      
  function initOnlineUserSection(user) {    
    var section = initUserSectionWithAvatar(user);
    
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
  
  function initOfflineUserSection(user) {    
    var section = initUserSectionWithAvatar(user);
    
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
  
  function initClosedUserSection(user) {        
    var section = initUserSectionWithAvatar(user);
    
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
  
  function initUserSectionWithAvatar(user) {
    var section = $("<li/>", {        
      class: "collection-item avatar invisible",
      "data-id": user.name.toLowerCase()
    }).appendTo($users);

    var logo = $("<img/>", {
      src: user.logo,
      class: "circle"
    }).appendTo(section);
    
    return section;
  }
})();