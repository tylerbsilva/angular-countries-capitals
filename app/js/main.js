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

app.factory('dataStore', function(){


  return {
    countryList : {},
    countryDetail : {

    }
  }
});

app.controller('MainController', ['$scope', '$http','$location', '$route', 'dataStore', function($scope, $http, $location, $route, dataStore){
  //make call to get country information
  var url = 'http://api.geonames.org/countryInfoJSON?username=tylerbsilva';
  $http({
    url: url,
    method: 'GET'
  }).success(function(data){
    // store data in factory
    dataStore.countryList = data.geonames;
    // log data for testing
    console.log(dataStore.countryList);
  });
}]);

app.controller('CountriesController', ['$scope', '$http','$location', '$route', 'dataStore', function($scope, $http, $location, $route, dataStore){
  // set countries data
  $scope.countries = dataStore.countryList;
  // call function to set detail of country
  $scope.countryDetail = function(country){
    dataStore.countryDetail.countryName = country.countryName;
    dataStore.countryDetail.areaInSqKm = country.areaInSqKm;
    dataStore.countryDetail.countryName = country.capital;
    $location('#/countries/'+ country.countryName +'/capital')
  }
}]);

app.controller('CountriesDetailController', ['$scope', '$http','$location', '$route', 'dataStore', function($scope, $http, $location, $route, dataStore){
  $scope.countryDetail = dataStore.countryDetail;
  console.log($scope.countryDetail);

}]);
