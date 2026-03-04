angular.module('pharmacyApp')
.service('AuthService', function() {
    this.getCurrentUser = function() {
        return JSON.parse(localStorage.getItem('pharmacyUser'));
    };
});