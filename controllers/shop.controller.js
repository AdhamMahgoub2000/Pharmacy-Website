angular.module('pharmacyApp')
.controller('ShopController', ['$scope', '$rootScope', '$location', 'MedicinesService','OrdersService',
 function($scope, $rootScope, $location, MedicinesService) {

    // ── Cart ──────────────────────────────────
    $rootScope.cart = $rootScope.cart || [];
    $scope.cart = $rootScope.cart;

    // ── State ─────────────────────────────────
    $scope.medicines        = [];
    $scope.categories       = [];
    $scope.loading          = true;
    $scope.error            = null;
    $scope.searchQuery      = '';
    $scope.selectedCategory = 'All';
    $scope.quickViewProduct = null;

    // ── Load on page open ─────────────────────
    async function init() {
        try {
            const [medicines, categories] = await Promise.all([
                MedicinesService.getAll(),
                MedicinesService.getCategories()
            ]);
            $scope.$apply(function() {
                $scope.medicines  = medicines;
                $scope.categories = ['All', ...categories];
                $scope.loading    = false;
            });
        } catch (err) {
            $scope.$apply(function() {
                $scope.error   = 'Failed to load products. Please try again.';
                $scope.loading = false;
            });
        }
    }
    init();

    // ── Category images (fallback) ────────────
    $scope.getCategoryImage = function(category) {
        const images = {
            'Painkillers':
                'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
            'Antibiotics':
                'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80',
            'Vitamins & Supplements':
                'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80',
            'Cold & Flu':
                'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=400&q=80',
            'Diabetes':
                'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80',
            'Heart & Blood Pressure':
                'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80',
            'Skin Care':
                'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80',
            'Digestive Health':
                'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?w=400&q=80',
            'Beauty & Personal Care':
                'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80'
        };
        return images[category] ||
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80';
    };

    // ── Filter ────────────────────────────────
    $scope.selectCategory = function(category) {
        $scope.selectedCategory = category;
        // scroll to shop section
        const el = document.getElementById('shopSection');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    $scope.filteredMedicines = function() {
        return $scope.medicines.filter(function(m) {
            const matchSearch = m.name.toLowerCase()
                .includes($scope.searchQuery.toLowerCase());
            const matchCat = $scope.selectedCategory === 'All' ||
                m.category === $scope.selectedCategory;
            return matchSearch && matchCat;
        });
    };

    // ── Cart ──────────────────────────────────
    $scope.addToCart = function(medicine) {
        if (medicine.stock === 0) return;
        const existing = $rootScope.cart.find(i => i.id === medicine.id);
        if (existing) {
            if (existing.qty < medicine.stock) existing.qty++;
        } else {
            $rootScope.cart.push({
                id:       medicine.id,
                name:     medicine.name,
                price:    medicine.price,
                stock:    medicine.stock,
                category: medicine.category,
                qty:      1
            });
        }
        $scope.showToast(medicine.name + ' added to cart! 🛒');
    };

    $scope.removeFromCart = function(item) {
        const i = $rootScope.cart.indexOf(item);
        $rootScope.cart.splice(i, 1);
    };

    $scope.increaseQty = function(item) {
        if (item.qty < item.stock) item.qty++;
    };

    $scope.decreaseQty = function(item) {
        if (item.qty > 1) item.qty--;
        else $scope.removeFromCart(item);
    };

    $scope.cartTotal = function() {
        return $rootScope.cart.reduce((s, i) => s + i.price * i.qty, 0);
    };

    $scope.cartCount = function() {
        return $rootScope.cart.reduce((s, i) => s + i.qty, 0);
    };

    $scope.isInCart = function(medicine) {
        return $rootScope.cart.some(i => i.id === medicine.id);
    };

    // ── Quick View ────────────────────────────
    $scope.quickView = function(medicine) {
        $scope.quickViewProduct = medicine;
    };

    $scope.closeQuickView = function(event) {
        if (event.target.classList.contains('quick-view-overlay')) {
            $scope.quickViewProduct = null;
        }
    };

    // ── Toast ─────────────────────────────────
    $scope.showToast = function(msg) {
        const t = document.createElement('div');
        t.style.cssText = `
            position:fixed; top:90px; right:24px;
            background:linear-gradient(135deg,#1e5fc2,#3d8ef8);
            color:white; padding:12px 20px; border-radius:12px;
            font-weight:600; font-size:0.88rem; z-index:9999;
            box-shadow:0 6px 20px rgba(30,95,194,0.4);
            font-family:'DM Sans',sans-serif;
            animation: slideInRight 0.3s ease;
        `;
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => {
            t.style.opacity = '0';
            t.style.transition = 'opacity 0.3s';
            setTimeout(() => t.remove(), 300);
        }, 2500);
    };

    // ── Scroll to shop ────────────────────────
    $scope.scrollToShop = function() {
        const el = document.getElementById('shopSection');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    // ── Slider ────────────────────────────────
    $scope.currentSlide = 0;
    const totalSlides = 3;

$scope.goToSlide = function(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots   = document.querySelectorAll('.slider-dot');

    // ⚠️ Safety check — stop if elements not found
    if (!slides.length || !dots.length) return;

    slides[$scope.currentSlide].classList.remove('active');
    dots[$scope.currentSlide].classList.remove('active');
    $scope.currentSlide = index;
    slides[$scope.currentSlide].classList.add('active');
    dots[$scope.currentSlide].classList.add('active');
};

$scope.nextSlide = function() {
    $scope.goToSlide(($scope.currentSlide + 1) % totalSlides);
};

$scope.prevSlide = function() {
    $scope.goToSlide(($scope.currentSlide - 1 + totalSlides) % totalSlides);
};

// Wait for page to fully load before starting auto slide
angular.element(document).ready(function() {
    const autoSlide = setInterval(() => {
        $scope.$apply(() => $scope.nextSlide());
    }, 5000);

    $scope.$on('$destroy', () => clearInterval(autoSlide));
});

    // ── Checkout ──────────────────────────────
    $scope.checkout = function() {
        if ($rootScope.cart.length === 0) return;
        $location.path('/confirmation');
    };

}]);