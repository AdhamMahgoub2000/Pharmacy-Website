angular.module('pharmacyApp')
.controller('AuthController', [
  '$scope', '$rootScope', '$location', 'AuthService',
  function($scope, $rootScope, $location, AuthService) {

    $scope.user       = {};
    $scope.loginError = null;
    $scope.loading    = false;

    AuthService.verifySession().then(function(result) {
      if (result.session) {
        return AuthService.getUserData(result.session.user.id);
      }
      return null;
    }).then(function(userData) {
      if (!userData) return;
      $scope.$applyAsync(function() {
        AuthService.setUser(userData);
        $location.path(userData.role === 'admin' ? '/dashboard' : '/shop');
      });
    });

    // ── Login ────────────────────────────────────────────────────
$scope.login = function() {
  if ($scope.loginForm.$invalid) return;

  $scope.loading    = true;
  $scope.loginError = null;

  AuthService.login($scope.user.email, $scope.user.password)
    .then(async function(response) {

      if (response.error) {
        $scope.loginError = response.error.message;
        return;
      }

      const session = response.data.session;

      if (!session) {
        $scope.loginError = 'Please confirm your email before logging in.';
        return;
      }

      try {
        const userData = await AuthService.getUserData(session.user.id);

        if (!userData) {
          $scope.loginError = 'Could not load user profile.';
          return;
        }

        AuthService.setUser(userData);

        if (userData.role === 'admin') {
          $location.path('/dashboard');
        } else if (userData.role === 'customer') {
          $location.path('/shop');
        } else {
          $scope.loginError = 'Unknown user role.';
        }

      } catch (err) {
        $scope.loginError = 'Failed to load user profile.';
      }

    })
    .catch(function(error) {
      $scope.loginError = error.message || 'Login failed.';
    })
    .finally(function() {
      $scope.loading = false;
      $scope.$applyAsync();   // only here if needed
    });
};

    // ── Reset Password ───────────────────────────────────────────
    $scope.resetData    = {};
    $scope.resetLoading = false;
    $scope.resetSuccess = null;
    $scope.resetError   = null;

    $scope.resetPassword = function() {
      if ($scope.resetForm.$invalid) return;
      $scope.resetLoading = true;
      $scope.resetError   = null;
      $scope.resetSuccess = null;

      // TODO: wire to AuthService.resetPassword when implemented
      $scope.$applyAsync(function() {
        $scope.resetLoading = false;
        $scope.resetSuccess = 'Reset link sent! Check your inbox.';
      });
    };

  }
]);