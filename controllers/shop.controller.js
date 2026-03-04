angular.module('pharmacyApp')
.controller('ShopController', ['$scope', '$rootScope', '$location', 'MedicinesService',
function($scope, $rootScope, $location, MedicinesService) {

    //c=art (shared across  pages 
    $rootScope.cart = $rootScope.cart || [];

    //  med from database
    $scope.medicines = [];
    $scope.categories = [];
    $scope.loading = true;
    $scope.error = null;

    //  Filters
    $scope.searchQuery = '';
    $scope.selectedCategory = 'All';

    //  Load everything 
    async function init() {
        try {
            // call med and categ at same time
            const [medicines, categories] = await Promise.all([
                MedicinesService.getAll(),
                MedicinesService.getCategories()
            ]);

            // Use $scope.$apply to tell data has changed
            $scope.$apply(function() {
                $scope.medicines = medicines;
                $scope.categories = ['All', ...categories];
                $scope.loading = false;
            });

        } catch (err) {
            $scope.$apply(function() {
                $scope.error = 'Failed to load medicines. Please try again.';
                $scope.loading = false;
            });
        }
    }

    init();

    // filter by categ
    $scope.selectCategory = function(category) {
        $scope.selectedCategory = category;
    };

    // Filter medicines shown on screen 
    $scope.filteredMedicines = function() {
        return $scope.medicines.filter(function(medicine) {

            // Check search query
            const matchesSearch = medicine.name
                .toLowerCase()
                .includes($scope.searchQuery.toLowerCase());

            // Check category
            const matchesCategory = $scope.selectedCategory === 'All' ||
                medicine.category === $scope.selectedCategory;

            return matchesSearch && matchesCategory;
        });
    };

    // add to cart 
    $scope.addToCart = function(medicine) {

        //  if medicine is out of stock
        if (medicine.stock === 0) return;

        // if already in cart
        const existing = $rootScope.cart.find(item => item.id === medicine.id);

        if (existing) {
            // in cart → increase quantity
            if (existing.qty < medicine.stock) {
                existing.qty++;
            }
        } else {
            // not in cart → add it
            $rootScope.cart.push({
                id: medicine.id,
                name: medicine.name,
                price: medicine.price,
                stock: medicine.stock,
                qty: 1
            });
        }
    };

    // remove from cart
    $scope.removeFromCart = function(item) {
        const index = $rootScope.cart.indexOf(item);
        $rootScope.cart.splice(index, 1);
    };

    // inc quantity 
    $scope.increaseQty = function(item) {
        if (item.qty < item.stock) {
            item.qty++;
        }
    };

    //  Dec quantity
    $scope.decreaseQty = function(item) {
        if (item.qty > 1) {
            item.qty--;
        } else {
            $scope.removeFromCart(item);
        }
    };

    // cart total
    $scope.cartTotal = function() {
        return $rootScope.cart.reduce(function(sum, item) {
            return sum + (item.price * item.qty);
        }, 0);
    };

    // Cart count 
    $scope.cartCount = function() {
        return $rootScope.cart.reduce(function(sum, item) {
            return sum + item.qty;
        }, 0);
    };

    //  confirmation page 
    $scope.checkout = function() {
        if ($rootScope.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        $location.path('/confirmation');
    };

}]);
