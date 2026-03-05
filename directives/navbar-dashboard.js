angular.module('pharmacyApp')
.directive('dashboardNavbar', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/navbarDashboard.html'
    };
});