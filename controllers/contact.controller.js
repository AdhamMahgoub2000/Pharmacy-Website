angular.module('pharmacyApp')
.controller('ContactController', ['$scope','$timeout','ContactService', function($scope,$timeout,ContactService) {
    // ── Form Model ──────────────────────────────────────────────────
    $scope.form = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        orderNumber: '',
        message: '',
        priority: 'medium'
    };

    $scope.formErrors   = {};
    $scope.submitting   = false;
    $scope.submitted    = false;
    $scope.openFaq      = null;

    // ── Validation ─────────────────────────────────────────────────
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    $scope.clearError = function(field) {
        delete $scope.formErrors[field];
    };

    function validate() {
        $scope.formErrors = {};
        var f = $scope.form;

        if (!f.name || f.name.trim().length < 2) {
            $scope.formErrors.name = 'Please enter your full name.';
        }
        if (!f.email || !validateEmail(f.email.trim())) {
            $scope.formErrors.email = 'Please enter a valid email address.';
        }
        if (!f.subject) {
            $scope.formErrors.subject = 'Please select a subject.';
        }
        if (!f.message || f.message.trim().length < 10) {
            $scope.formErrors.message = 'Message must be at least 10 characters.';
        }

        return Object.keys($scope.formErrors).length === 0;
    }

$scope.submitForm = async function () {
    if (!validate()) return;

    $scope.submitting = true;

    const request = {
        name: $scope.form.name,
        email: $scope.form.email,
        number: $scope.form.number,
        priority: $scope.form.priority,
        subject: $scope.form.subject,
        order_number: $scope.form.orderNumber,
        description: $scope.form.message,
    };

    await ContactService.sendRequest(request);

    $scope.$applyAsync(function () {

        $scope.submitting = false;
        $scope.submitted = true;

        $timeout(function () {
            $scope.submitted = false;
            $scope.resetForm();
        }, 5000);

    });
};

    // ── Reset ──────────────────────────────────────────────────────
    $scope.resetForm = function() {
        $scope.form = {
            name: '',
            email: '',
            phone: '',
            subject: '',
            orderNumber: '',
            message: '',
            priority: 'medium'
        };
        $scope.formErrors = {};
        $scope.submitted  = false;
    };

    // ── FAQ Toggle ─────────────────────────────────────────────────
    $scope.toggleFaq = function(index) {
        $scope.openFaq = ($scope.openFaq === index) ? null : index;
    };

}]);
