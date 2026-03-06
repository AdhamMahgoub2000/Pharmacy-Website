angular.module('pharmacyApp')
.controller('SidebarCtrl', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {

  $scope.navItems = [
    { key: 'dashboard', icon: 'dashboard',      label: 'Dashboard'      },
    { key: 'medicines', icon: 'pill',            label: 'Medicines'      },
    { key: 'customers', icon: 'group',           label: 'Customers'      },
    { key: 'invoices',  icon: 'receipt_long',    label: 'Sales Invoices' },
  ];

  $scope.activeNav  = $location.path().replace('/', '') || 'dashboard';
  $scope.sidebarOpen = false;

  // Listen for toggle events from the navbar hamburger
  // NOTE: $broadcast already runs inside a digest — never call $apply here
  $rootScope.$on('toggleSidebar', function() {
    $scope.sidebarOpen = !$scope.sidebarOpen;
  });

  $scope.closeSidebar = function() {
    $scope.sidebarOpen = false;
  };

  $scope.setActive = function(key) {
    $scope.activeNav   = key;
    $scope.sidebarOpen = false; // auto-close on mobile after navigation
    $location.path('/' + key);
  };

  // Keep activeNav in sync when navigating via URL
  $scope.$on('$routeChangeSuccess', function() {
    $scope.activeNav = $location.path().replace('/', '') || 'dashboard';
  });

}]);
