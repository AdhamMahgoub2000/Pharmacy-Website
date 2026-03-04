
angular.module('pharmacyApp', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider

    // ─── Public ───────────────────────────────
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'AuthController'
    })    
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegisterController'
    })

    // ─── Customer Routes ──────────────────────
    .when('/shop', {
      templateUrl: 'views/shop.html',
      controller: 'ShopController'
    })
    .when('/confirmation', {
      templateUrl: 'views/confirmation.html',
      controller: 'ConfirmationController'
    })
    .when('/orders', {
      templateUrl: 'views/orders-history.html',
      controller: 'OrdersHistoryController'
    })
    .when('/account', {
      templateUrl: 'views/account.html',
      controller: 'AccountController'
    })

    // ─── Admin Routes ─────────────────────────
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardController'
    })
    .when('/medicines', {
      templateUrl: 'views/medicines.html',
      controller: 'MedicinesController'
    })
    .when('/customers', {
      templateUrl: 'views/customers.html',
      controller: 'CustomersController'
    })
    .when('/invoices', {
      templateUrl: 'views/invoices.html',
      controller: 'InvoiceController'
    })
    .when('/users', {
      templateUrl: 'views/users.html',
      controller: 'UsersController'
    })

    // ─── Default ──────────────────────────────
    .otherwise({ redirectTo: '/login' });
}])

// Route Guard 
// This runs on every page change and checks if user is allowed
.run(['$rootScope', '$location', 'AuthService',
  function($rootScope, $location, AuthService) {

    // ─── TEMPORARY: Fake customer login for testing ───
    // we need to delete once login page is ready 
     $rootScope.currentUser = {
        id: '123',
        name: 'Youmna',
        email: 'youmna@test.com',
        role: 'customer'
     };
    // ─────────────────────────────────────────────────

    const customerPages = ['/shop', '/confirmation', '/orders', '/account'];
    const adminPages = ['/dashboard', '/medicines', '/customers', '/invoices', '/users'];

    $rootScope.$on('$routeChangeStart', function(event, next) {
      const user = $rootScope.currentUser;
      const path = $location.path();

    //   if (!user && path !== '/login') {
    //     $location.path('/login');
    //     return;
    //   }

    //   if (user && user.role === 'customer' && adminPages.includes(path)) {
    //     $location.path('/shop');
    //     return;
    //   }

    //   if (user && user.role === 'admin' && customerPages.includes(path)) {
    //     $location.path('/dashboard');
    //     return;
    //   }

    //   if (user && path === '/login') {
    //     $location.path(user.role === 'admin' ? '/dashboard' : '/shop');
    //     return;
    //   }
    });
}]);




