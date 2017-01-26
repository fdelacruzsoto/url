'use strict';

angular.module('URL')
  .controller('ListCtrl', ['$scope', '$http', '$location', '$mdToast', '$mdDialog', 'ListService', 'BASE_URL', function($scope, $http, $location, $mdToast, $mdDialog, ListService, BASE_URL) {	
    
    
    $scope.todosLoad = function() {
      ListService.list().then(function(res) {
        
        console.log("Data: " + res.data);
        
        if (res.data.Message == 'OK') {
          $scope.todos = res.data.Results;
        } else {
          $mdToast.show(
            $mdToast.simple().textContent("Error Message: " + res.data.Message).position('top right')
          );
        }
      }, function(res) {
        $mdToast.show(
          $mdToast.simple().textContent("Something went wrong, please try again.").position('top right')
        );       
      }); 
    }
    
    $scope.todosLoad();
    
  }]);