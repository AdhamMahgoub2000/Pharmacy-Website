angular.module('pharmacyApp')
.directive('appSidebar', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/sideBar.html'
    };
});