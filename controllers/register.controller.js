angular.module('pharmacyApp')
.controller('RegisterController', [
  '$scope',
  'AuthService',
  function($scope, AuthService) {

    $scope.user = {};
    $scope.registerError = null;
    $scope.loading = false;
    $scope.registrationSuccess = false;

    $scope.register = function () {

      if ($scope.registerForm.$invalid) return;

      $scope.loading = true;
      $scope.registerError = null;

AuthService.register($scope.user)
  .then(function(response) {

    $scope.$applyAsync(function() {
      if (response.error) {
        $scope.registerError = response.error.message;
        return;
      }

      $scope.registrationSuccess = true;
    });

  })
  .catch(function(error) {

    $scope.$applyAsync(function() {
      $scope.registerError = error.message;
    });

  })
  .finally(function() {

    $scope.$applyAsync(function() {
      $scope.loading = false;
    });

  });
  }
}
]);