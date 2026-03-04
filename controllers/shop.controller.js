angular.module('pharmacyApp')
.controller('ShopController', ['$scope', '$rootScope', '$location', 'MedicinesService',
function($scope, $rootScope, $location, MedicinesService) {

    // ─── Cart ─────────────────────────────────
    $rootScope.cart = $rootScope.cart || [];

    // ─── State ────────────────────────────────
    $scope.medicines = [];
    $scope.categories = [];
    $scope.loading = true;
    $scope.error = null;
    $scope.searchQuery = '';
    $scope.selectedCategory = 'All';

    // ─── Load data when page opens ────────────
    async function init() {
        try {
            const [medicines, categories] = await Promise.all([
                MedicinesService.getAll(),
                MedicinesService.getCategories()
            ]);
            $scope.$apply(function() {
                $scope.medicines = medicines;
                $scope.categories = ['All', ...categories];
                $scope.loading = false;
            });
        } catch (err) {
            $scope.$apply(function() {
                $scope.error = 'Failed to load products. Please try again.';
                $scope.loading = false;
            });
        }
    }

    init();

    // ─── Category filter ──────────────────────
    $scope.selectCategory = function(category) {
        $scope.selectedCategory = category;
    };

    // ─── Filter medicines ─────────────────────
    $scope.filteredMedicines = function() {
        return $scope.medicines.filter(function(medicine) {
            const matchesSearch = medicine.name
                .toLowerCase()
                .includes($scope.searchQuery.toLowerCase());
            const matchesCategory =
                $scope.selectedCategory === 'All' ||
                medicine.category === $scope.selectedCategory;
            return matchesSearch && matchesCategory;
        });
    };

    // ─── Add to cart ──────────────────────────
    $scope.addToCart = function(medicine) {
        if (medicine.stock === 0) return;
        const existing = $rootScope.cart.find(item => item.id === medicine.id);
        if (existing) {
            if (existing.qty < medicine.stock) existing.qty++;
        } else {
            $rootScope.cart.push({
                id: medicine.id,
                name: medicine.name,
                price: medicine.price,
                stock: medicine.stock,
                qty: 1
            });
        }
    };

    // ─── Remove from cart ─────────────────────
    $scope.removeFromCart = function(item) {
        const index = $rootScope.cart.indexOf(item);
        $rootScope.cart.splice(index, 1);
    };

    // ─── Increase quantity ────────────────────
    $scope.increaseQty = function(item) {
        if (item.qty < item.stock) item.qty++;
    };

    // ─── Decrease quantity ────────────────────
    $scope.decreaseQty = function(item) {
        if (item.qty > 1) {
            item.qty--;
        } else {
            $scope.removeFromCart(item);
        }
    };

    // ─── Cart total ───────────────────────────
    $scope.cartTotal = function() {
        return $rootScope.cart.reduce(function(sum, item) {
            return sum + (item.price * item.qty);
        }, 0);
    };

    // ─── Cart count ───────────────────────────
    $scope.cartCount = function() {
        return $rootScope.cart.reduce(function(sum, item) {
            return sum + item.qty;
        }, 0);
    };

    // ─── Check if in cart ─────────────────────
    $scope.isInCart = function(medicine) {
        return $rootScope.cart.some(item => item.id === medicine.id);
    };

    // ─── Fallback image per category ──────────
    $scope.getCategoryImage = function(category) {
        const images = {
            'Painkillers':
                'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80',
            'Antibiotics':
                'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&q=80',
            'Vitamins & Supplements':
                'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&q=80',
            'Cold & Flu':
                'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=300&q=80',
            'Diabetes':
                'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&q=80',
            'Heart & Blood Pressure':
                'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&q=80',
            'Skin Care':
                'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80',
            'Digestive Health':
                'https://images.unsplash.com/photo-1559757175-7cb036e0d465?w=300&q=80',
            'Beauty & Personal Care':
                'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80'
        };
        return images[category] ||
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80';
    };

    // ─── Slider logic ─────────────────────────
    $scope.currentSlide = 0;
    const totalSlides = 3;

    $scope.goToSlide = function(index) {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dot');
        slides[$scope.currentSlide].classList.remove('active');
        dots[$scope.currentSlide].classList.remove('active');
        $scope.currentSlide = index;
        slides[$scope.currentSlide].classList.add('active');
        dots[$scope.currentSlide].classList.add('active');
    };

    $scope.nextSlide = function() {
        const next = ($scope.currentSlide + 1) % totalSlides;
        $scope.goToSlide(next);
    };

    $scope.prevSlide = function() {
        const prev = ($scope.currentSlide - 1 + totalSlides) % totalSlides;
        $scope.goToSlide(prev);
    };

    // Auto slide every 4 seconds
    const autoSlide = setInterval(function() {
        $scope.$apply(function() { $scope.nextSlide(); });
    }, 4000);

    $scope.$on('$destroy', function() {
        clearInterval(autoSlide);
    });

    // ─── Checkout ─────────────────────────────
    $scope.checkout = function() {
        if ($rootScope.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        $location.path('/confirmation');
    };

}]);