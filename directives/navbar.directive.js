angular.module('pharmacyApp')
.directive('appNavbar', function() {
    return {
        restrict: 'E',
        template: `
        <nav class="app-navbar">
            <div class="navbar-inner">

                <!-- Brand -->
                <a class="nav-brand" href="#/shop">
                    <div class="nav-brand-icon">
                        <i class="fas fa-clinic-medical"></i>
                    </div>
                    <span class="nav-brand-name">PharmaCare</span>
                </a>

                <!-- Customer Links -->
                <div class="nav-links" ng-if="currentUser.role === 'customer'">
                    <a class="nav-link-item" href="#/shop">
                        <i class="fas fa-store me-1"></i> Shop
                    </a>
                    <a class="nav-link-item" ng-href="#!/customers/{{currentUser.id}}" >
                        <i class="fas fa-box me-1"></i> My Orders
                    </a>
                    <a class="nav-link-item" href="#!/contact">
                        <i class="fas fa-headset me-1"></i> Contact Us
                    </a>
                </div>

                <!-- Admin Links -->
                <div class="nav-links" ng-if="currentUser.role === 'admin'">
                    <a class="nav-link-item" href="#/dashboard">
                        <i class="fas fa-chart-bar me-1"></i> Dashboard
                    </a>
                    <a class="nav-link-item" href="#/medicines">
                        <i class="fas fa-pills me-1"></i> Medicines
                    </a>
                    <a class="nav-link-item" href="#/customers">
                        <i class="fas fa-users me-1"></i> Customers
                    </a>
                    <a class="nav-link-item" href="#/invoices">
                        <i class="fas fa-file-invoice me-1"></i> Invoices
                    </a>
                </div>

                <!-- Right Side -->
                <div class="nav-right">

                    <div class="welcome-chip" ng-if="currentUser">
                         <span>{{ currentUser.name }}</span>
                    </div>

                    <a class="nav-icon-btn" ng-href="#!/customers/{{currentUser.id}}"
                        ng-if="currentUser.role === 'customer'"
                        title="My Account">
                        <i class="fas fa-user"></i>
                    </a>

                    <button class="nav-cart-btn"
                        ng-if="currentUser.role === 'customer'"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#cartOffcanvas">
                        <i class="fas fa-shopping-cart me-2"></i>
                        Cart
                        <span class="nav-cart-badge"
                            ng-show="cartCount() > 0">
                            {{ cartCount() }}
                        </span>
                    </button>

                    <button class="nav-logout-btn"
                        ng-click="logout()"
                        title="Logout">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>

                </div>
            </div>
        </nav>
        `,
        controller: ['$scope', '$rootScope', '$location', 'AuthService',
        function($scope, $rootScope, $location, AuthService) {

            $rootScope.$watch('currentUser', function(newVal) {
                $scope.currentUser = newVal;
            }, true);

            $scope.cartCount = function() {
                if (!$rootScope.cart) return 0;
                return $rootScope.cart.reduce((s, i) => s + i.qty, 0);
            };

            $scope.logout = function() {
                AuthService.logout().then(function() {
                    $rootScope.currentUser = null;
                    $rootScope.cart = [];
                    // Ensure Angular notices the change
                    $scope.$applyAsync(() => {
                        $location.path('/login');
                    });
    });
};

        }]
    };
});