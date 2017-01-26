'use strict';

angular.module('URL').factory('HomeService', ['$http', '$localStorage', 'BASE_URL', function($http, $localStorage, BASE_URL) {
  return {
    short: function(data) {
      return $http.post(BASE_URL.urlservices + '/create', data).then(function(res) {
        return res;
      }, function(res) {
        return res;
      });
    },
  };
}]);