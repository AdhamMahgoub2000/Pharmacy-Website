// controllers/navbar-dashboard.controller.js
// Used by: directives/navbar-dashboard.js  →  <dashboard-navbar>
// Template: views/navbarDashboard.html
//
// BUGS FIXED:
//   1. No DI array — unsafe for minification and $rootScope was never injected.
//   2. Hardcoded $scope.user object instead of reading from $rootScope.currentUser
//      (set by AuthService.setUser after login). The navbar was showing a fake user
//      instead of the real logged-in user.
//   3. No logout function.

angular.module('pharmacyApp')
.controller('NavbarCtrl', ['$scope', '$rootScope', '$location', 'AuthService',
  function($scope, $rootScope, $location, AuthService) {

    $scope.searchQuery      = '';
    $scope.hasNotifications = true;

    // Mirror $rootScope.currentUser so the template can use {{ currentUser.name }}
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