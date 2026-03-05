// controllers/sidebar.controller.js
// Used by: directives/sidebar.directive.js  →  <app-sidebar>
// Template: views/sideBar.html
//
// BUG FIXED: No DI array — unsafe for minification.
//            Also fixed: missing closing semicolon (was `})` not `});`)

angular.module('pharmacyApp')
.controller('SidebarCtrl', ['$scope', '$location', function($scope, $location) {

  // Nav items — keys match $routeProvider admin route paths exactly
  $scope.navItems = [
    { key: 'dashboard', icon: 'dashboard',      label: 'Dashboard'      },
    { key: 'medicines', icon: 'pill',            label: 'Medicines'      },
    { key: 'customers', icon: 'group',           label: 'Customers'      },
    { key: 'invoices',  icon: 'receipt_long',    label: 'Sales Invoices' },
    { key: 'users',     icon: 'manage_accounts', label: 'Users'          },
  ];

  // Sync active item with current URL on controller load
  $scope.activeNav = $location.path().replace('/', '') || 'dashboard';

  $scope.setActive = function(key) {
    $scope.activeNav = key;
    $location.path('/' + key);
  };

}]);