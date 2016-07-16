(function() {
  var truthfulApp = angular.module("truthfulApp", []);
  truthfulApp
    .controller("ArticleListController", ArticleListController)
    .factory("dataService", dataService)
    .factory("articleFactory", articleFactory);

  ArticleListController.$inject = ["dataService", "articleFactory"];

  function ArticleListController(dataService, articleFactory) {
    var scope = this;
    scope.articlesByYears = [];

    activate();

    function activate() {
      getArticleList();
    }

    function getArticleList() {
      dataService.getArticleList()
        .then(function(data) {
          scope.articlesByYears = articleFactory.createYearlyArticleGroups(data);
          console.log(scope.articlesByYears);
        });
    }
  }

  function articleFactory() {

    return {
      createYearlyArticleGroups: createYearlyArticleGroups
    };

    function createYearlyArticleGroups(data) {
      var yearlyGroups = groupBy(data, function(article) {
        return article.createDate.getYear();
      }, function(g) {
        return {
          year: g.key,
          articles: g.values
        };
      });

      var articlesByYears = yearlyGroups.map(function(group) {
        var monthlyGroups = groupBy(group.articles, function(article) {
          return article.createDate.getMonth();
        }, function(g) {
          return {
            monthIndex: g.key,
            articles: g.values
          };
        });

        monthlyGroups.sort(function(a, b) {
          return b.monthIndex - a.monthIndex;
        });

        return {
          year: group.year,
          months: monthlyGroups
        };
      });

      articlesByYears.sort(function(a, b) {
        return a.year - b.year;
      });

      return articlesByYears;
    }

    function groupBy(source, keySelector, elementSelector) {
      var result = source.reduce(function(array, element) {
        var key = keySelector(element);

        var hasKey = array.some(function(item) {
          return item.key === key ? ((item.values.push(element)), true) : false;
        });

        if (!hasKey) {
          array.push({
            key: key,
            values: [element]
          });
        }

        return array;
      }, []).map(function(g, index) {
        return elementSelector(g);
      });

      return result;
    }
  }

  function dataService($q, $http) {
    return {
      getYears: getYears,
      getArticleList: getArticleList
    };

    function getYears() {
      var deferred = $q.defer();
      var years = [];
      for (var i = 1890; i < 1985; i++) {
        years.push(i);
      }
      deferred.resolve(years);
      return deferred.promise;
    }

    function getArticleList() {
      var deferred = $q.defer();
      deferred.resolve(getData());
      return deferred.promise;

      function getData() {
        return [{
          title: "Title 1",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi blandit metus dolor, suscipit imperdiet erat consectetur id. Curabitur eget erat eros. Sed lobortis iaculis tellus, eu bibendum neque molestie eu. Vivamus nunc velit, dapibus eu dignissim vel, lobortis nec ante. Nulla condimentum sollicitudin augue non iaculis. Cras ut nisi placerat sem iaculis porta ut luctus urna. Pellentesque vulputate diam felis, ut sollicitudin est rutrum non. Pellentesque vulputate elementum congue. Fusce convallis scelerisque felis, sed tristique elit tincidunt quis. Morbi placerat sagittis ligula, a venenatis metus suscipit vel. Proin id congue sem. Duis egestas posuere hendrerit.",
          createDate: new Date(1980, 1, 1)
        }, {
          title: "Title 2",
          text: "Pellentesque feugiat urna quis nisi ullamcorper volutpat. Mauris tempor tristique leo, sed sagittis justo iaculis vel. Pellentesque est sapien, posuere sit amet ultrices et, tristique in neque. Donec cursus blandit nunc eget blandit. Maecenas vel risus ut urna cursus dictum sit amet et arcu. Proin a maximus nulla. Nam eget ligula sit amet diam lacinia venenatis ut maximus quam. Nunc vehicula, tortor a porta mattis, turpis nulla blandit est, vitae venenatis arcu ipsum eget sem.",
          createDate: new Date(1981, 1, 1)
        }];
      }
    }
  }
})();
