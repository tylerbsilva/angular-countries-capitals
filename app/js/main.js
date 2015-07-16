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
      templateUrl : './js/templates/home.html',
      controller: 'MainController'
    })
    .when('/countries', {
      templateUrl: './js/templates/countries.html',
      controller: 'CountriesController'
    })
    .when('/countries/:country/capital', {
      templateUrl: './js/templates/countries-detail.html',
      controller: 'CountriesDetailController'
    })
    .otherwise('/');
}]);

app.factory('dataStore', ['$http', function($http){
  // Make HTTP call once and the store data as cache
  return {
    getCountries : function(){
      return $http({
        url: 'http://api.geonames.org/countryInfoJSON?username=tylerbsilva',
        method: 'GET'
      })
    },
    getCity : function(city, countryCode){
      return $http({
        url: 'http://api.geonames.org/searchJSON',
        method: 'GET',
        params: {
          q: city,
          country: countryCode,
          name_equals: city,
          isNameRequired: true,
          username: 'tylerbsilva',
          maxRows: 1
        }
      })
    },
    countryList : {},
    countryDetail : {},
    cityDetail : {}
  }
}]);

app.controller('MainController', ['$scope', '$route', '$q', 'dataStore', '$location', function($scope, $route, $q, dataStore, $location){
  //When button is clicked, change to next page
  $scope.dataReceived = false;
  $scope.countries = [];

  function wait() {
    var defer = $q.defer();
    // Simulating doing some asynchronous operation...
    setTimeout(function(){
      defer.resolve();
    }, 2000);
    return defer.promise;
  }
  dataStore.getCountries().success(function(data){
    dataStore.countryList = data.geonames;
    $scope.countries = dataStore.countryList;
  });
  wait().then(function(){
    $scope.dataReceived = true;
  });

  $scope.browseCountries = function(){
    $location.path('/countries');
  };
}]);

app.controller('CountriesController', ['$scope', '$http','$location', '$route', 'dataStore', function($scope, $http, $location, $route, dataStore){
  // set countries data
  $scope.countries = dataStore.countryList;
  // call function to set detail of country
  $scope.countryDetail = function(country){
    // grab the city details
    dataStore.getCity(country.capital, country.countryCode).success(function(data){
      dataStore.countryDetail.population = data.geonames[0];
      console.log(dataStore.cityDetail);
    });

    dataStore.countryDetail.countryName = country.countryName;
    dataStore.countryDetail.areaInSqKm = country.areaInSqKm;
    dataStore.countryDetail.capital = country.capital;
    dataStore.countryDetail.continentName = country.continent;

    $location.path('/countries/'+ country.countryName +'/capital');
  };
}]);

app.controller('CountriesDetailController', ['$scope', '$http','$location', '$route', 'dataStore', function($scope, $http, $location, $route, dataStore){
  $scope.countryDetail = dataStore.countryDetail;
}]);
