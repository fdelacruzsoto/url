'use strict';

var app = angular.module('URL', [
  'ngStorage',
  'ngRoute',
  'ngMaterial'
]);

app.config(['$routeProvider', '$httpProvider', '$locationProvider', '$mdThemingProvider', function($routeProvider, $httpProvider, $locationProvider, $mdThemingProvider) {

  $routeProvider.
    when('/', {
      templateUrl: 'partials/home.html',
      controller: 'HomeCtrl'
    }).
    when('/list', {
      templateUrl: 'partials/list.html',
      controller: 'ListCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
	
  $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('orange');

}]);