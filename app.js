angular.module('pharmacyApp', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthController'
    })
    .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterController'
    })
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
    .otherwise({ redirectTo: '/login' });
}])

.run(['$rootScope', '$location', 'AuthService',
function($rootScope, $location, AuthService) {

    const customerPages = ['/shop', '/confirmation', '/orders', '/account'];
    const adminPages    = ['/dashboard', '/medicines', '/customers', '/invoices', '/users'];

    // ── Restore session on page refresh ──
    // ── Restore session on page refresh ──
$rootScope.currentUser = null;
$rootScope.appReady = false;

$rootScope.currentUser = null;

AuthService.verifySession().then(async function(result) {
    if (result.session) {
        const data = await AuthService.getUserData(result.session.user.id);
        if (data) {
            $rootScope.$apply(function() {
                $rootScope.currentUser = {
                    id:      result.session.user.id,
                    name:    data.name,
                    email:   data.email,
                    phone:   data.phone,
                    address: data.address,
                    role:    data.role
                };
            });
        }
    } else {
        // No session → clear everything
        $rootScope.$apply(function() {
            $rootScope.currentUser = null;
        });
    }
});

    // ── Route guard ──
    $rootScope.$on('$routeChangeStart', function(event, next) {
        const user = $rootScope.currentUser;
        const path = $location.path();

        if (!user && path !== '/login' && path !== '/register') {
            $location.path('/login');
            return;
        }
        if (user && user.role === 'customer' && adminPages.includes(path)) {
            $location.path('/shop');
            return;
        }
        if (user && user.role === 'admin' && customerPages.includes(path)) {
            $location.path('/dashboard');
            return;
        }
        if (user && path === '/login') {
            $location.path(user.role === 'admin' ? '/dashboard' : '/shop');
            return;
        }
    });

}]);
