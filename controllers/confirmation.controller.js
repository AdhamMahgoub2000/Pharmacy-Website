angular.module('pharmacyApp')
.controller('ConfirmationController', ['$scope', '$rootScope', '$location', 'OrdersService',
function($scope, $rootScope, $location, OrdersService) {

    // ── Redirect if cart is empty ──────────────
    if (!$rootScope.cart || $rootScope.cart.length === 0) {
        $location.path('/shop');
        return;
    }

    // ── State ──────────────────────────────────
    $scope.cart         = $rootScope.cart;
    $scope.currentUser  = $rootScope.currentUser;
    $scope.loading      = false;
    $scope.error        = null;
    $scope.orderSuccess = false;

    $scope.delivery = {
        name:    $rootScope.currentUser.name    || '',
        phone:   $rootScope.currentUser.phone   || '',
        address: $rootScope.currentUser.address || '',
        notes:   ''
    };

    // ── Cart total ─────────────────────────────
    $scope.cartTotal = function() {
        return $rootScope.cart.reduce((s, i) => s + i.price * i.qty, 0);
    };

    // ── Cart count ─────────────────────────────
    $scope.cartCount = function() {
        return $rootScope.cart.reduce((s, i) => s + i.qty, 0);
    };

    // ── Category images ────────────────────────
    $scope.getCategoryImage = function(category) {
        const images = {
            'Painkillers':
                'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&q=80',
            'Antibiotics':
                'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=100&q=80',
            'Vitamins & Supplements':
                'https://images.unsplash.com/photo-1550572017-edd951b55104?w=100&q=80',
            'Cold & Flu':
                'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=100&q=80',
            'Diabetes':
                'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=100&q=80',
            'Heart & Blood Pressure':
                'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=100&q=80',
            'Skin Care':
                'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100&q=80',
            'Digestive Health':
                'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?w=100&q=80',
            'Beauty & Personal Care':
                'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&q=80'
        };
        return images[category] ||
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&q=80';
    };

    // ── Place order ────────────────────────────
    $scope.placeOrder = async function() {
        if (!$scope.delivery.name ||
            !$scope.delivery.phone ||
            !$scope.delivery.address) {
            $scope.error = 'Please fill all required fields.';
            return;
        }

        $scope.loading = true;
        $scope.error   = null;

        const result = await OrdersService.createOrder(
            $rootScope.cart,
            $rootScope.currentUser,
            $scope.delivery.notes
        );

        $scope.$apply(function() {
            $scope.loading = false;
            if (result.success) {
                $rootScope.cart     = [];
                $scope.orderSuccess = true;
            } else {
                $scope.error = 'Failed to place order. Please try again.';
            }
        });
    };

    // ── Back to shop ───────────────────────────
    $scope.backToShop = function() {
        $location.path('/shop');
    };

}]);