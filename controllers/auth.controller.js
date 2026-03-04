angular.module('pharmacyApp')
.controller('AuthController', [
'$scope',
'$rootScope',
'$location',
'AuthService',
function($scope, $rootScope, $location, AuthService) {

    $scope.user = {};
    $scope.loginError = null;
    $scope.loading = false;

    $scope.login = function() {
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

                        if (!data) {
                            $scope.$apply(() => {
                                $scope.loginError = "User profile not found.";
                            });
                            return;
                        }

                        $scope.$apply(() => {

                            // ── Save user for entire app ──
                            $rootScope.currentUser = {
                                id:      session.user.id,
                                name:    data.name,
                                email:   data.email,
                                phone:   data.phone,
                                address: data.address,
                                role:    data.role
                            };

                            // ── Redirect based on role ──
                            if (data.role === 'admin') {
                                $location.path('/dashboard');
                            } else if (data.role === 'customer') {
                                $location.path('/shop');
                            } else {
                                $scope.loginError = "Unknown user role.";
                            }
                        });

                    } catch (err) {
                        $scope.$apply(() => {
                            $scope.loginError = "Failed to get user data.";
                        });
                    }
                });
            })
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

    // ── Reset Password ──
    $scope.resetData = {};
    $scope.showResetForm = false;
    $scope.resetLoading = false;
    $scope.resetSuccess = null;
    $scope.resetError = null;

    $scope.resetPassword = function() {
        if ($scope.resetForm.$invalid) return;
        $scope.resetLoading = true;
        $scope.resetError = null;
        $scope.resetSuccess = null;

        AuthService.client.auth.resetPasswordForEmail(
            $scope.resetData.email
        ).then(function(response) {
            $scope.$applyAsync(function() {
                if (response.error) {
                    $scope.resetError = response.error.message;
                } else {
                    $scope.resetSuccess = "Reset link sent! Check your email.";
                }
                $scope.resetLoading = false;
            });
        });
    };

}]);