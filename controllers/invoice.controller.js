angular.module('pharmacyApp')
.controller('InvoiceController',
['$scope','$routeParams','$location','CustomersService',
function($scope,$routeParams,$location,CustomersService){

    $scope.loading = true;
    $scope.order = null;
    $scope.customer = null;

    const orderId = $routeParams.orderId;

    async function loadInvoice(){

        try{

            const customers = await CustomersService.getAllCustomers();

            let foundOrder = null;
            let foundCustomer = null;

            customers.forEach(c => {

                if(c.orders){
                    const order = c.orders.find(o => o.id === orderId);

                    if(order){
                        foundOrder = order;
                        foundCustomer = c;
                    }
                }

            });

            $scope.order = foundOrder;
            $scope.customer = foundCustomer;

            $scope.loading = false;
            $scope.$apply();

        }catch(err){

            console.error(err);
            $scope.loading = false;
        }

    }

    loadInvoice();

    $scope.goBack = function(){

        $location.path('/customers/' + $scope.customer.id);

    };

}]);