(function() {
  var demoApp = angular.module("demoApp", []);
  
  demoApp
    .controller("ShuttleListsController", ShuttleListsController)
    .factory("dataService", dataService)
    .factory("nodeFactory", nodeFactory)
    .directive("splitter", ['$document', splitter]);
        
  ShuttleListsController.$inject = ["dataService", "nodeFactory"];
  
  function ShuttleListsController(dataService, nodeFactory) {
    var scope = this; 
    scope.nodes = [];    
    scope.moveIntoTopList = moveIntoTopList;
    scope.moveIntoBottomList = moveIntoBottomList;
    scope.moveSplitter = moveSplitter;
    
    activate();

    function activate() {
      getLists();               
    }
    
    function moveSplitter() {
      console.log("moveSplitter")
    }
    
    function moveIntoTopList() { 
      scope.nodes.forEach(function(item) {
        if(item.isSelected) {
          item.isConnected = true;
        }
      });      
    }
    
    function moveIntoBottomList() {
      scope.nodes.forEach(function(item) {
        if(item.isSelected) {
          item.isConnected = false;
        }
      });      
    }

    function getLists() {
      dataService.getLists()
        .then(function(data) {          
          var topList = data.topList.map(nodeFactory.createConnectedNode);
          var bottomList = data.bottomList.map(nodeFactory.createDisconnectedNode);      
          scope.nodes = topList.concat(bottomList);
        });                   
    }
  }   
  
  function dataService($q, $http) {
    return {
        getLists: getLists
    };

    function getLists() {
      var deferred = $q.defer();
      deferred.resolve(getData());
      return deferred.promise;
      
      function getData() {
        return {
          topList: [
            "Lorem ipsum dolor sit amet",
            "Curabitur rhoncus velit eget",
            "Duis a diam non leo dapibus",
            "Phasellus nec dolor luctus",
            "Donec aliquet neque sit amet",
            "Suspendisse in arcu sit amet",
            "Quisque vitae nisi aliquam",
            "In non ipsum in sem aliquet",
            "Quisque id est condimentum",
          ],
          bottomList: [
            "Etiam aliquet turpis ac bibendum",
            "Praesent malesuada ex ac mi porta",
            "Morbi congue risus non metus",
            "Fusce a orci ac massa auctor suscipit",
            "Sed vitae metus sed nisi ullamcorper",
            "Vivamus suscipit quam sit amet",
            "Aenean eleifend nunc non rhoncus luctus",
            "In quis ipsum bibendum turpis fringilla",
            "Proin nec dolor eu turpis auctor pretium",
          ],
        };
      }
    }
  }   
  
  function nodeFactory() {
    
    return {
      createConnectedNode: createConnectedNode,
      createDisconnectedNode: createDisconnectedNode
    };
    
    function createConnectedNode(name) {
      return {
        isConnected: true,
        isSelected: false,
        name: name
      };
    }

    function createDisconnectedNode(name) {
      return {
        isConnected: false,          
        isSelected: false,
        name: name
      };
    }
  }
  
  function splitter($document) {
    var $upPanel = $("#upPanel");
    var $splitter = $("#splitter");
    var $container = $("#container");
    
    return {
      link: function(scope, element, attr) {
        element.on("mousedown", function(e) {    
          toggleNoSelect();
          $document.on("mousemove", onMousemove);
          $document.on("mouseup", onMouseup);    
        });       
      }
    };
    
    function onMousemove(e) {    
      var delta = e.pageY - $splitter.offset().top;
      var upHeight = $upPanel.height();
      $upPanel.height(upHeight + delta);    
    }

    function onMouseup() {    
      $document.off("mousemove", onMousemove);
      $document.off("mouseup", onMouseup);
      toggleNoSelect();
    }

    function toggleNoSelect() {
      $container.toggleClass("noselect");    
    }
  }
})();