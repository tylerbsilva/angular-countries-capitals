var app = angular.module('CountriesCapitals', [
  'ngRoute',
  'ngAnimate'
]);

app.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

app.run(function($rootScope, $location, $timeout) {
  $rootScope.$on('$routeChangeError', function() {
    $location.path("/");
  });
  $rootScope.$on('$routeChangeStart', function() {
    $rootScope.isLoading = true;
  });
  $rootScope.$on('$routeChangeSuccess', function() {
    $timeout(function() {
      $rootScope.isLoading = false;
    }, 1000);
  });
});

app.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl : './js/home/home.html',
      controller: 'MainController'
    })
    .when('/countries', {
      templateUrl: './js/countries/countries.html',
      controller: 'CountriesController'
    })
    .when('/earnings', {
      templateUrl: './js/countries-detail/countries-detail.html',
      controller: 'MainController'
    })
    .otherwise('/');
}]);

app.factory('dataStore', function(){
  return {
    countryList : {}
  }
});

app.controller('MainController', ['$scope', '$http','$location', '$route', 'dataStore', function($scope, $http, $location, $route, dataStore){
  var url = 'http://api.geonames.org/countryInfoJSON?username=tylerbsilva';
  $http({
    url: url,
    method: 'GET'
  }).success(function(data){
    dataStore.countryList = data.geonames;
    console.log(dataStore.countryList);
  });
}]);

app.controller('CountriesController', ['$scope', '$http','$location', '$route', 'dataStore', function($scope, $http, $location, $route, dataStore){
  $scope.countries = dataStore.countryList;
}]);
