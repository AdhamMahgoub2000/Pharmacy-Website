angular.module('pharmacyApp')
.controller('AuthController', [
  '$scope',
  '$location',
  'AuthService',
  function($scope, $location, AuthService) {


    $scope.user = {};
    $scope.loginError = null;
    $scope.loading = false;

    
    $scope.login = function () {

      if ($scope.loginForm.$invalid) return;

      $scope.loading = true;
      $scope.loginError = null;

      AuthService.login($scope.user.email, $scope.user.password)
        .then(function(response) {
          $scope.$applyAsync(async function() {
            if (response.error) {
              $scope.loginError = response.error.message;
              return;
            }
            const session = response.data.session;
            if (!session) {
              $scope.loginError = "Please confirm your email before logging in.";
              return;
            }

           try {
            const data = await AuthService.getUserData(session.user.id);
            $scope.$apply(() => {
                if (data.role === 'admin') {
                $location.path('/dashboard');
                } else if (data.role === 'customer') {
                $location.path('/shop');
                } else {
                $scope.loginError = "Unknown user role";
                }
            });

} catch (err) {
  $scope.$apply(() => {
    $scope.loginError = "Failed to get user role";
  });
}})})
        .catch(function(error) {
          $scope.$applyAsync(function() {
            $scope.loginError = error.message || "Login failed.";
          });
        })
        .finally(function() {
          $scope.$applyAsync(function() {

            $scope.loading = false;
          });
        });
    };

  }
]);