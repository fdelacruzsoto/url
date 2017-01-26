'use strict';

angular.module('URL').factory('ListService', ['$http', '$localStorage', 'BASE_URL', function($http, $localStorage, BASE_URL) {
  return {
    list: function() {
      return $http.get(BASE_URL.urlservices + '/list').then(function(res) {
        return res;
      }, function(res) {
        return res;
      });
    },
  };
}]);