angular.module('pharmacyApp')
.controller('NavbarCtrl', [
'$scope', '$rootScope', '$location', '$sce', '$timeout',
'AuthService', 'MedicinesService', 'CustomersService',
function($scope, $rootScope, $location, $sce, $timeout,
         AuthService, MedicinesService, CustomersService) {
  $scope.hasNotifications = true;
  $scope.currentUser      = $rootScope.currentUser;
  $rootScope.$watch('currentUser', function(val) { $scope.currentUser = val; });

  $scope.getInitials = function(name) {
    if (!name) return '?';
    return name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().slice(0, 2);
  };

  $scope.clearNotifications = function() { $scope.hasNotifications = false; };

  $scope.toggleSidebar = function() {
    $rootScope.$broadcast('toggleSidebar');
  };

  $scope.logout = function() {
    AuthService.logout().then(function() {
      $scope.$applyAsync(function() { $location.path('/login'); });
    });
  };

  // ── Search state ──────────────────────────────────────────────────────
  $scope.searchQuery   = '';
  $scope.medicines     = [];
  $scope.customers     = [];
  $scope.searching     = false;
  $scope.showDropdown  = false;
  $scope.focused       = false;

  var searchTimer = null;

  // ── Highlight matching text ───────────────────────────────────────────
  $scope.highlight = function(text, query) {
    if (!text || !query) return $sce.trustAsHtml(text || '');
    var escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var html    = String(text).replace(
      new RegExp('(' + escaped + ')', 'gi'),
      '<mark class="search-highlight">$1</mark>'
    );
    return $sce.trustAsHtml(html);
  };

  // ── Input handlers ────────────────────────────────────────────────────
  $scope.onFocus = function() {
    $scope.focused = true;
    if ($scope.searchQuery.length >= 2) $scope.showDropdown = true;
  };

  $scope.onBlur = function() {
    // Delay so ng-mousedown on results fires before dropdown hides
    $timeout(function() {
      $scope.focused      = false;
      $scope.showDropdown = false;
    }, 200);
  };

  $scope.clearSearch = function($event) {
    $event.preventDefault();
    $scope.searchQuery  = '';
    $scope.medicines    = [];
    $scope.customers    = [];
    $scope.showDropdown = false;
  };

  // ── Debounced search ──────────────────────────────────────────────────
  $scope.onSearch = function() {
    var q = ($scope.searchQuery || '').trim();

    if (q.length < 2) {
      $scope.medicines    = [];
      $scope.customers    = [];
      $scope.showDropdown = q.length > 0; // show "keep typing" prompt
      $scope.searching    = false;
      if (searchTimer) $timeout.cancel(searchTimer);
      return;
    }

    $scope.showDropdown = true;
    $scope.searching    = true;

    if (searchTimer) $timeout.cancel(searchTimer);
    searchTimer = $timeout(function() { runSearch(q); }, 300);
  };

  async function runSearch(q) {
    try {
      const [meds, custs] = await Promise.all([
        MedicinesService.search(q),
        CustomersService.getAllCustomers()
      ]);

      // Filter customers client-side (no search endpoint exists)
      const ql = q.toLowerCase();
      const filteredCusts = (custs || []).filter(function(c) {
        return (c.name  && c.name.toLowerCase().includes(ql))  ||
               (c.email && c.email.toLowerCase().includes(ql)) ||
               (c.full_name && c.full_name.toLowerCase().includes(ql));
      });

      $scope.$apply(function() {
        $scope.medicines = (meds || []).slice(0, 5);
        $scope.customers = filteredCusts.slice(0, 5);
        $scope.searching = false;
      });
    } catch (err) {
      console.error('Search error:', err);
      $scope.$apply(function() { $scope.searching = false; });
    }
  }

  // ── Navigation from results ───────────────────────────────────────────
  $scope.goToMedicines = function($event) {
    $event.preventDefault();
    $scope.showDropdown = false;
    $scope.$applyAsync(function() { $location.path('/medicines'); });
  };

  $scope.goToCustomer = function(c, $event) {
    $event.preventDefault();
    $scope.showDropdown = false;
    $scope.$applyAsync(function() { $location.path('/customers/' + c.id); });
  };

}]);
