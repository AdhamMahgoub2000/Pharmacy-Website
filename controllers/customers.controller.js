angular.module('pharmacyApp')
.controller('CustomersController', ['$scope','$location', 'CustomersService', 
function($scope,$location, CustomersService) {
    $scope.customers = [];
    $scope.loading   = true;
    $scope.error     = null;

    // ── Load customers on page open ─────────────────
    async function loadCustomers() {
        try {
            const customers = await CustomersService.getAllCustomers();
            $scope.$apply(function() {
                $scope.customers = customers;
                $scope.loading   = false;
            });
        } catch (err) {
            $scope.$apply(function() {
                $scope.error   = 'Failed to load customers. Please try again.';
                $scope.loading = false;
            });
            console.error('Failed to load customers:', err);
        }
    }

    loadCustomers();
    $scope.selectedCustomer = null;

// Open Edit Modal
$scope.editCustomer = function(customer) {
    $scope.selectedCustomer = angular.copy(customer); 
    var editModal = new bootstrap.Modal(document.getElementById('editCustomerModal'));
    editModal.show();
};

$scope.saveCustomer = async function() {
    try {
        await CustomersService.updateCustomer($scope.selectedCustomer);
        // update the list locally
        const index = $scope.customers.findIndex(c => c.id === $scope.selectedCustomer.id);
        if (index !== -1) $scope.customers[index] = angular.copy($scope.selectedCustomer);

        $scope.$apply();
        bootstrap.Modal.getInstance(document.getElementById('editCustomerModal')).hide();
        $scope.showToast('Customer updated successfully!');
    } catch (err) {
        console.error(err);
        $scope.showToast('Failed to update customer.', 'danger');
    }
};

// Delete Customer
$scope.deleteCustomer = async function(customer) {
    if (!confirm(`Are you sure you want to delete ${customer.full_name || customer.name}?`)) return;

    try {
        await CustomersService.deleteCustomer(customer.id);
        $scope.customers = $scope.customers.filter(c => c.id !== customer.id);
        $scope.$apply();
        $scope.showToast('Customer deleted successfully!', 'danger');
    } catch (err) {
        console.error(err);
        $scope.showToast('Failed to delete customer.', 'danger');
    }
};
$scope.goToProfile = function(customerId) {
  $location.path('/customers/' + customerId);
};
}]);