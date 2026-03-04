angular.module('pharmacyApp')
.controller('UsersController', function($scope) {
    // Initialize form states
    $scope.showResetForm = false;
    $scope.user = {};
    $scope.resetData = {};
    $scope.loading = false;
    $scope.resetLoading = false;
    $scope.loginError = null;
    $scope.resetError = null;
    $scope.resetSuccess = null;

    // Login function
    $scope.login = function() {
        if ($scope.loginForm.$valid) {
            $scope.loading = true;
            // Add your login logic here
            console.log('Login attempt:', $scope.user);
            // After login, set loading to false
        }
    };

    // Reset password function
    $scope.resetPassword = function() {
        if ($scope.resetForm.$valid) {
            $scope.resetLoading = true;
            // Add your reset password logic here
            console.log('Reset password attempt:', $scope.resetData);
            // After reset, set resetLoading to false
        }
    };

    // Watch for showResetForm changes to clear the login form when showing reset form
    $scope.$watch('showResetForm', function(newVal) {
        if (newVal) {
            // Clear login form when showing reset form
            if ($scope.loginForm) {
                $scope.loginForm.$setPristine();
                $scope.loginForm.$setUntouched();
            }
            $scope.user = {};
            $scope.loginError = null;
        } else {
            // Clear reset form when showing login form
            if ($scope.resetForm) {
                $scope.resetForm.$setPristine();
                $scope.resetForm.$setUntouched();
            }
            $scope.resetData = {};
            $scope.resetError = null;
            $scope.resetSuccess = null;
        }
    });
});