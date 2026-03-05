angular.module('pharmacyApp')
.controller('CustomerProfileController', ['$scope', '$routeParams', '$location', 'CustomersService', 'OrdersService',
function($scope, $routeParams, $location, CustomersService, OrdersService) {


  $scope.loading = true;
  $scope.error = null;
  $scope.customer = null;
  $scope.stats = [];           
  $scope.orders = [];         
  $scope.selectedCustomer = null;

  $scope.goBack = function() {
    $location.path('/customers');
  };

  async function loadCustomer() {
    try {
      const allCustomers = await CustomersService.getAllCustomers();
      const customerId = $routeParams.id;
      const customer = allCustomers.find(c => c.id === customerId);

      if (!customer) throw new Error('Customer not found');

      // Get customer orders
      let orders = [];
      try {
        orders = await OrdersService.getCustomerOrders(customerId);
        console.log(orders)
      } catch (err) {
        console.warn('Failed to load customer orders', err);
      }

      // Example stats — you can replace with actual logic
      const stats = [
        { label: 'Total Orders', value: orders.length, icon: 'shopping_cart', iconColor: 'text-primary' },
        { label: 'Last Order', value: orders[0]?.created_at || '-', icon: 'calendar_today', iconColor: 'text-success' },
        { label: 'Active', value: customer.is_active ? 'Yes' : 'No', icon: 'check_circle', iconColor: customer.is_active ? 'text-success' : 'text-danger' }
      ];

      $scope.$apply(function() {
        $scope.customer = customer;
        $scope.stats = stats;
        $scope.orders = orders;
        $scope.loading = false;
      });

    } catch (err) {
      console.error(err);
      $scope.$apply(function() {
        $scope.error = 'Failed to load customer.';
        $scope.loading = false;
      });
    }
  }

  loadCustomer();

  // ── Edit Customer ───────────────────────
  $scope.editCustomer = function(customer) {
    $scope.selectedCustomer = angular.copy(customer);
    const modalEl = document.getElementById('editCustomerModal');
    new bootstrap.Modal(modalEl).show();
  };


  $scope.deleteCustomer = async function(customer) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await CustomersService.deleteCustomer(customer.id);
      $scope.$apply(function() {
        alert('Customer deleted!');
        $scope.goBack();
      });
    } catch (err) {
      $scope.$apply(function() {
        alert('Failed to delete customer');
      });
      console.error(err);
    }
  };

  // ── Save Edited Customer ─────────────────
  $scope.saveCustomer = async function() {
    try {
      await CustomersService.updateCustomer($scope.selectedCustomer);
      $scope.$apply(function() {
        $scope.customer = angular.copy($scope.selectedCustomer);
        const modalEl = document.getElementById('editCustomerModal');
        bootstrap.Modal.getInstance(modalEl).hide();
        alert('Customer updated!');
      });
    } catch (err) {
      $scope.$apply(function() {
        alert('Failed to update customer');
      });
      console.error(err);
    }
  };
$scope.viewInvoice = function(order){
  $scope.selectedOrder = angular.copy(order);

  const modal = new bootstrap.Modal(
    document.getElementById('invoiceModal')
  );

  modal.show();
};

$scope.showFullInvoice = function(order){
  $location.path('/invoice/' + order.id);
};
}]);