angular.module('pharmacyApp')
.controller('ShopController', ['$scope', '$rootScope', '$location', 'MedicinesService',
function($scope, $rootScope, $location, MedicinesService) {

    // ── Cart ───────────────────────────────────────────────────────────
    $rootScope.cart = $rootScope.cart || [];
    $scope.cart = $rootScope.cart;

    // ── State ──────────────────────────────────────────────────────────
    $scope.medicines        = [];
    $scope.categories       = [];
    $scope.loading          = true;
    $scope.error            = null;
    $scope.searchQuery      = '';
    $scope.selectedCategory = 'All';
    $scope.quickViewProduct = null;

    // ── Pagination ────────────────────────────────────────────────────
    $scope.currentPage  = 1;
    $scope.perPage      = 15;

    // Reset to page 1 whenever filter/search changes
    $scope.$watch('searchQuery',      function() { $scope.currentPage = 1; });
    $scope.$watch('selectedCategory', function() { $scope.currentPage = 1; });

    $scope.filteredMedicines = function() {
        return $scope.medicines.filter(function(m) {
            var matchSearch = m.name.toLowerCase()
                .includes($scope.searchQuery.toLowerCase());
            var matchCat = $scope.selectedCategory === 'All' ||
                m.category === $scope.selectedCategory;
            return matchSearch && matchCat;
        });
    };

    $scope.pagedMedicines = function() {
        var all   = $scope.filteredMedicines();
        var start = ($scope.currentPage - 1) * $scope.perPage;
        return all.slice(start, start + $scope.perPage);
    };

    $scope.totalPages = function() {
        return Math.ceil($scope.filteredMedicines().length / $scope.perPage);
    };

    // Array of page numbers for the pagination bar
    $scope.pageNumbers = function() {
        var total  = $scope.totalPages();
        var cur    = $scope.currentPage;
        var pages  = [];
        var start  = Math.max(1, cur - 2);
        var end    = Math.min(total, cur + 2);
        // Always show first
        if (start > 1) { pages.push(1); if (start > 2) pages.push('…'); }
        for (var i = start; i <= end; i++) pages.push(i);
        // Always show last
        if (end < total) { if (end < total - 1) pages.push('…'); pages.push(total); }
        return pages;
    };

    $scope.goToPage = function(p) {
        if (p === '…' || p < 1 || p > $scope.totalPages()) return;
        $scope.currentPage = p;
        var el = document.getElementById('shopSection');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    $scope.prevPage = function() { if ($scope.currentPage > 1) $scope.goToPage($scope.currentPage - 1); };
    $scope.nextPage = function() { if ($scope.currentPage < $scope.totalPages()) $scope.goToPage($scope.currentPage + 1); };
    $scope.getPageEnd = function() { return Math.min($scope.currentPage * $scope.perPage, $scope.filteredMedicines().length); };

    // ── Load ───────────────────────────────────────────────────────────
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

    // ── Category images (fallback) ─────────────────────────────────────
    $scope.getCategoryImage = function(category) {
        var images = {
            'Painkillers':              'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
            'Antibiotics':              'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80',
            'Vitamins & Supplements':   'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80',
            'Cold & Flu':               'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=400&q=80',
            'Diabetes':                 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80',
            'Heart & Blood Pressure':   'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80',
            'Skin Care':                'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80',
            'Digestive Health':         'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?w=400&q=80',
            'Beauty & Personal Care':   'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80'
        };
        return images[category] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80';
    };

    // ── Filter / search ────────────────────────────────────────────────
    $scope.selectCategory = function(category) {
        $scope.selectedCategory = category;
        var el = document.getElementById('shopSection');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    // ── Cart actions ───────────────────────────────────────────────────
    $scope.addToCart = function(medicine) {
        if (medicine.stock === 0) return;
        var existing = $rootScope.cart.find(function(i) { return i.id === medicine.id; });
        if (existing) {
            if (existing.qty < medicine.stock) existing.qty++;
        } else {
            $rootScope.cart.push({
                id: medicine.id, name: medicine.name,
                price: medicine.price, stock: medicine.stock,
                category: medicine.category, qty: 1
            });
        }
        $scope.showToast('Added to cart — ' + medicine.name);
    };

    $scope.removeFromCart = function(item) {
        $rootScope.cart.splice($rootScope.cart.indexOf(item), 1);
    };

    $scope.increaseQty = function(item) { if (item.qty < item.stock) item.qty++; };
    $scope.decreaseQty = function(item) {
        if (item.qty > 1) item.qty--;
        else $scope.removeFromCart(item);
    };

    $scope.cartTotal = function() { return $rootScope.cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0); };
    $scope.cartCount = function() { return $rootScope.cart.reduce(function(s, i) { return s + i.qty; }, 0); };
    $scope.isInCart  = function(m) { return $rootScope.cart.some(function(i) { return i.id === m.id; }); };

    // ── Quick view ─────────────────────────────────────────────────────
    $scope.quickView = function(medicine) { $scope.quickViewProduct = medicine; };
    $scope.closeQuickView = function(event) {
        if (event.target.classList.contains('quick-view-overlay'))
            $scope.quickViewProduct = null;
    };

    // ── Toast ──────────────────────────────────────────────────────────
    $scope.showToast = function(msg) {
        var t = document.createElement('div');
        t.style.cssText = 'position:fixed;top:90px;right:24px;background:var(--blue);color:white;padding:12px 20px;border-radius:12px;font-weight:600;font-size:0.88rem;z-index:9999;box-shadow:0 6px 20px rgba(30,95,194,0.4);font-family:\'DM Sans\',sans-serif;animation:slideInRight 0.3s ease;';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(function() {
            t.style.opacity = '0'; t.style.transition = 'opacity 0.3s';
            setTimeout(function() { t.remove(); }, 300);
        }, 2200);
    };

    // ── Scroll helper ──────────────────────────────────────────────────
    $scope.scrollToShop = function() {
        var el = document.getElementById('shopSection');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    // ── Hero slider ────────────────────────────────────────────────────
    $scope.currentSlide = 0;
    var totalSlides = 3;

    $scope.goToSlide = function(index) {
        var slides = document.querySelectorAll('.hero-slide');
        var dots   = document.querySelectorAll('.slider-dot');
        if (!slides.length || !dots.length) return;
        slides[$scope.currentSlide].classList.remove('active');
        dots[$scope.currentSlide].classList.remove('active');
        $scope.currentSlide = index;
        slides[$scope.currentSlide].classList.add('active');
        dots[$scope.currentSlide].classList.add('active');
    };

    $scope.nextSlide = function() { $scope.goToSlide(($scope.currentSlide + 1) % totalSlides); };
    $scope.prevSlide = function() { $scope.goToSlide(($scope.currentSlide - 1 + totalSlides) % totalSlides); };

    angular.element(document).ready(function() {
        var autoSlide = setInterval(function() {
            $scope.$apply(function() { $scope.nextSlide(); });
        }, 5000);
        $scope.$on('$destroy', function() { clearInterval(autoSlide); });
    });

    // ── Checkout ───────────────────────────────────────────────────────
    $scope.checkout = function() {
        if ($rootScope.cart.length === 0) return;
        $location.path('/confirmation');
    };

}]);
