

angular.module('pharmacyApp')
.controller('NavbarCtrl', ['$scope', '$rootScope', '$location', 'AuthService',
  function($scope, $rootScope, $location, AuthService) {

    $scope.searchQuery      = '';
    $scope.hasNotifications = true;

    $scope.currentUser = $rootScope.currentUser;

    // Keep in sync if currentUser changes after login (e.g. page refresh)
    $rootScope.$watch('currentUser', function(val) {
      $scope.currentUser = val;
    });

    // Initials fallback for avatar (e.g. "Sarah Smith" → "SS")
    $scope.getInitials = function(name) {
      if (!name) return '?';
      return name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().slice(0, 2);
    };

    $scope.clearNotifications = function() {
      $scope.hasNotifications = false;
    };

    $scope.logout = function() {
      AuthService.logout().then(function() {
        $scope.$applyAsync(function() {
          $location.path('/login');
        });
      });
    };

  }
]);