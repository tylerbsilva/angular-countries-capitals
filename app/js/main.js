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
    .when('/countries/:country/capital', {
      templateUrl: './js/countries-detail/countries-detail.html',
      controller: 'CountriesDetailController'
    })
    .otherwise('/');
}]);

app.factory('dataStore', ['$http', function($http){
  // Make HTTP call once and the store data as cache
  var countryList;
  var dataFetch = false;
  var url = 'http://api.geonames.org/countryInfoJSON?username=tylerbsilva';
  $http({
    url: url,
    method: 'GET'
  }).success(function(data){
    countryList = data.geonames;
    console.log(countryList);
    dataFetch = true;
  });
  return {
    dataReceived : dataFetch,
    countries : countryList
  };
}]);

app.controller('MainController', ['$scope', '$route', '$q', 'dataStore', function($scope, $route, $q, dataStore){
  //When button is clicked, change to next page
  $scope.dataReceived = false;
  function wait() {
    var defer = $q.defer();
    // Simulating doing some asynchronous operation...
    setTimeout(function(){
      defer.resolve();
    }, 2000);
    return defer.promise;
  }
  wait().then(function(){
    $scope.dataReceived = true;
  });
  $scope.browseCountries = function(){
    $location('#/countries');
  };
}]);

app.controller('CountriesController', ['$scope', '$http','$location', '$route', 'dataStore', function($scope, $http, $location, $route, dataStore){
  // set countries data
  $scope.countries = dataStore.countries;
  // call function to set detail of country
  $scope.countryDetail = function(country){
    dataStore.countryDetail.countryName = country.countryName;
    dataStore.countryDetail.areaInSqKm = country.areaInSqKm;
    dataStore.countryDetail.countryName = country.capital;
    $location('#/countries/'+ country.countryName +'/capital');
  };
}]);

app.controller('CountriesDetailController', ['$scope', '$http','$location', '$route', 'dataStore', function($scope, $http, $location, $route, dataStore){
  $scope.countryDetail = dataStore.countryDetail;
  console.log($scope.countryDetail);

}]);
