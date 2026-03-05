angular.module('pharmacyApp').controller('SidebarCtrl', function ($scope, $location) {

    $scope.navItems = [
      { key: 'dashboard', icon: 'dashboard',   label: 'Dashboard'      },
      { key: 'medicines', icon: 'pill',         label: 'Medicines'      },
      { key: 'customers', icon: 'group',        label: 'Customers'      },
      { key: 'invoices',  icon: 'receipt_long', label: 'Sales Invoices' },
      { key: 'inventory', icon: 'inventory_2',  label: 'Inventory'      },
      { key: 'reports',   icon: 'bar_chart',    label: 'Reports'        },
      { key: 'settings',  icon: 'settings',     label: 'Settings'       },
    ];

    // Keep active nav in sync with the current route
    $scope.activeNav = $location.path().replace('/', '') || 'dashboard';

    $scope.setActive = function (key) {
      $scope.activeNav = key;
      $location.path('/' + key);
    };
  })