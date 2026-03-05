angular.module('pharmacyApp')
.controller('InvoiceController',
['$scope','$routeParams','$location','CustomersService','OrdersService',
function($scope,$routeParams,$location,CustomersService,OrdersService){

    $scope.loading = true;
    $scope.order = null;
    $scope.customer = null;

    const orderId = $routeParams.orderId;

    async function loadInvoice(){
        try{
            // Step 1: Get all customers to find who owns this order
            const customers = await CustomersService.getAllCustomers();

            // Step 2: For each customer, fetch their orders and find the matching one
            let foundOrder = null;
            let foundCustomer = null;

            for(const c of customers){
                const orders = await OrdersService.getCustomerOrders(c.id);
                const match = orders.find(o => o.id === orderId);
                if(match){
                    foundOrder = match;
                    foundCustomer = c;
                    break;
                }
            }

            $scope.$apply(function(){
                $scope.order = foundOrder;
                $scope.customer = foundCustomer;
                $scope.loading = false;
            });

        }catch(err){
            console.error(err);
            $scope.$apply(function(){
                $scope.loading = false;
            });
        }
    }

    loadInvoice();

    $scope.goBack = function(){
        if($scope.customer){
            $location.path('/customers/' + $scope.customer.id);
        } else {
            $location.path('/customers');
        }
    };

}]);
