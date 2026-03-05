  angular.module('pharmacyApp').controller('NavbarCtrl', function ($scope) {

    $scope.searchQuery      = '';
    $scope.hasNotifications = true;

    $scope.user = {
      name:   'Dr. Sarah Smith',
      role:   'Administrator',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeU_v8Y91neiuShx9Z-dZT4oOuV1ZPNGn_DNZrwrTt2caONaUIWQBmiFWDeGX9G9azhEV5YjjYHEq6qmVq2kPmbTNUFfEkfIQi9BeKo5X1E5rzv4YzToMFdqQfjkGCUToVEljPKw3g1v1X-966S7aL_SFxpzamcglqocerb_hcMDi1IeEPaaUY6b04FEDXoTwDCgIbPPf_6wIOJLkqDeeHiZcNm1XYV0as7CgEnvEWcYu7s2wCzLkqDVmjvklvBana335aSdNQOFOi'
    };

    $scope.clearNotifications = function () {
      $scope.hasNotifications = false;
    };
  })