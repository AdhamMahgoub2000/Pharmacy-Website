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

                <!-- Customer Links (desktop) -->
                <div class="nav-links" ng-if="currentUser.role === 'customer'">
                    <a class="nav-link-item" href="#/shop">
                        <i class="fas fa-store me-1"></i> Shop
                    </a>
                    <a class="nav-link-item" ng-href="#!/customers/{{currentUser.id}}">
                        <i class="fas fa-box me-1"></i> My Orders
                    </a>
                    <a class="nav-link-item" href="#!/contact">
                        <i class="fas fa-headset me-1"></i> Contact Us
                    </a>
                </div>

                <!-- Admin Links (desktop) -->
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
                        <span class="cart-btn-label">Cart</span>
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

                    <!-- Hamburger (mobile only) -->
                    <button class="nav-hamburger"
                        ng-click="mobileOpen = !mobileOpen"
                        ng-class="{ open: mobileOpen }"
                        aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                </div>
            </div>

            <!-- Mobile Drawer -->
            <div class="nav-mobile-drawer" ng-class="{ open: mobileOpen }" ng-click="mobileOpen = false">
                <div class="nav-mobile-inner" ng-click="$event.stopPropagation()">

                    <!-- Drawer Header -->
                    <div class="nav-mobile-header">
                        <div class="nav-brand">
                            <div class="nav-brand-icon">
                                <i class="fas fa-clinic-medical"></i>
                            </div>
                            <span class="nav-brand-name">PharmaCare</span>
                        </div>
                        <button class="nav-mobile-close" ng-click="mobileOpen = false">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- User chip -->
                    <div class="nav-mobile-user" ng-if="currentUser">
                        <i class="fas fa-user-circle nav-mobile-user-icon"></i>
                        <span>{{ currentUser.name }}</span>
                    </div>

                    <!-- Mobile: Customer Links -->
                    <nav class="nav-mobile-links" ng-if="currentUser.role === 'customer'">
                        <a class="nav-mobile-link" href="#/shop" ng-click="mobileOpen = false">
                            <i class="fas fa-store"></i> Shop
                        </a>
                        <a class="nav-mobile-link" ng-href="#!/customers/{{currentUser.id}}" ng-click="mobileOpen = false">
                            <i class="fas fa-box"></i> My Orders
                        </a>
                        <a class="nav-mobile-link" href="#!/contact" ng-click="mobileOpen = false">
                            <i class="fas fa-headset"></i> Contact Us
                        </a>
                        <button class="nav-mobile-link nav-mobile-cart"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#cartOffcanvas"
                            ng-click="mobileOpen = false">
                            <i class="fas fa-shopping-cart"></i>
                            Cart
                            <span class="nav-cart-badge" ng-show="cartCount() > 0">{{ cartCount() }}</span>
                        </button>
                    </nav>

                    <!-- Mobile: Admin Links -->
                    <nav class="nav-mobile-links" ng-if="currentUser.role === 'admin'">
                        <a class="nav-mobile-link" href="#/dashboard" ng-click="mobileOpen = false">
                            <i class="fas fa-chart-bar"></i> Dashboard
                        </a>
                        <a class="nav-mobile-link" href="#/medicines" ng-click="mobileOpen = false">
                            <i class="fas fa-pills"></i> Medicines
                        </a>
                        <a class="nav-mobile-link" href="#/customers" ng-click="mobileOpen = false">
                            <i class="fas fa-users"></i> Customers
                        </a>
                        <a class="nav-mobile-link" href="#/invoices" ng-click="mobileOpen = false">
                            <i class="fas fa-file-invoice"></i> Invoices
                        </a>
                    </nav>

                    <!-- Mobile Logout -->
                    <div class="nav-mobile-footer">
                        <button class="nav-mobile-logout" ng-click="logout()">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>

                </div>
            </div>

        </nav>
        `,
        controller: ['$scope', '$rootScope', '$location', 'AuthService',
        function($scope, $rootScope, $location, AuthService) {

            $scope.mobileOpen = false;

            $rootScope.$watch('currentUser', function(newVal) {
                $scope.currentUser = newVal;
            }, true);

            $scope.cartCount = function() {
                if (!$rootScope.cart) return 0;
                return $rootScope.cart.reduce((s, i) => s + i.qty, 0);
            };

            $scope.logout = function() {
                $scope.mobileOpen = false;
                AuthService.logout().then(function() {
                    $rootScope.currentUser = null;
                    $rootScope.cart = [];
                    $scope.$applyAsync(() => {
                        $location.path('/login');
                    });
                });
            };

            // Close drawer on route change
            $rootScope.$on('$routeChangeStart', function() {
                $scope.mobileOpen = false;
            });

        }]
    };
});