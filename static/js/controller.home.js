'use strict';

angular.module('URL')
  .controller('HomeCtrl', ['$scope', '$http', '$location', '$mdToast', '$mdDialog', 'HomeService', 'BASE_URL', function($scope, $http, $location, $mdToast, $mdDialog, HomeService, BASE_URL) {	
    var data;
    
    $scope.list = function() {
      $location.path('list'); 
    }
    
    $scope.short = function() {
      var formData = {
        url: $scope.url
      }
      
      data = HomeService.short(formData).then(function(res) {
        
        console.log("Data: " + res.data);
        
        if (res.data.Message == 'OK') {
          var textContent = "New url: " + BASE_URL.urlservices + '/r/' + res.data.Results[0].short_url;
          
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('This is the new url')
              .textContent(textContent)
              .ariaLabel('URL')
              .ok('Got it!')
          );
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
    
  }]);