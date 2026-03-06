angular.module('pharmacyApp')
.controller('SalesInvoicesController',
['$scope', '$location', 'OrdersService',
function($scope, $location, OrdersService) {

    $scope.loading    = true;
    $scope.allInvoices  = [];
    $scope.filtered   = [];
    $scope.search     = '';
    $scope.statusFilter = 'all';
    $scope.selectedInvoice = null;

    // ── Stats ─────────────────────────────────
    $scope.stats = { total: 0, paid: 0, pending: 0, revenue: 0 };

    async function loadInvoices() {
        try {
            const data = await OrdersService.getAllInvoices();

            $scope.$apply(function() {
                $scope.allInvoices = data || [];
                applyFilters();
                computeStats();
                $scope.loading = false;
            });
        } catch(err) {
            console.error(err);
            $scope.$apply(function() { $scope.loading = false; });
        }
    }

    function computeStats() {
        const inv = $scope.allInvoices;
        $scope.stats.total   = inv.length;
        $scope.stats.paid    = inv.filter(i => i.status === 'paid').length;
        $scope.stats.pending = inv.filter(i => i.status === 'pending').length;
        $scope.stats.revenue = inv.reduce(
            (s, i) => s + ((i.status === 'paid' ? i.total : 0) || 0),
            0
            );
    }

    function applyFilters() {
        const q      = ($scope.search || '').toLowerCase();
        const status = $scope.statusFilter;

        $scope.filtered = $scope.allInvoices.filter(function(inv) {
            const customerName = (inv.users && (inv.users.name || inv.users.email)) || '';
            const matchSearch  = !q
                || inv.id.toLowerCase().includes(q)
                || customerName.toLowerCase().includes(q);
            const matchStatus  = status === 'all' || inv.status === status;
            return matchSearch && matchStatus;
        });
    }

    $scope.onSearch = function()       { applyFilters(); };
    $scope.setStatus = function(s)     { $scope.statusFilter = s; applyFilters(); };

    // ── Preview modal ─────────────────────────
    $scope.previewInvoice = function(inv) {
        $scope.selectedInvoice = inv;
        var modal = new bootstrap.Modal(document.getElementById('invoicePreviewModal'));
        modal.show();
    };

    // ── Navigate to full invoice page ─────────
    $scope.openFullInvoice = function(inv) {
        const modalEl = document.getElementById('invoicePreviewModal');
        const instance = bootstrap.Modal.getInstance(modalEl);
        if (instance) {
            instance.hide();
            modalEl.addEventListener('hidden.bs.modal', function handler() {
                modalEl.removeEventListener('hidden.bs.modal', handler);
                document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                $scope.$apply(function() {
                    $location.path('/invoice/' + inv.id);
                });
            }, { once: true });
        } else {
            $location.path('/invoice/' + inv.id);
        }
    };

    $scope.getCustomerInitial = function(inv) {
        const name = inv.users && (inv.users.name || inv.users.email);
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    $scope.getCustomerName = function(inv) {
        return (inv.users && (inv.users.name || inv.users.email)) || 'Unknown';
    };

    $scope.invoiceItemCount = function(inv) {
        return (inv.invoice_items && inv.invoice_items.length) || 0;
    };
    $scope.updatePayment = function(invoice) {
    $scope.selectedInvoice = angular.copy(invoice);
    $scope.showPaymentModal = true;
};

$scope.ApprovePayment = async function () {
    try {

        const { data, error } = await OrdersService.updatePayment(
            $scope.selectedInvoice.id,
            'paid'
        );

        if (error) throw error;

        $scope.showPaymentModal = false;

        loadInvoices();
    } catch (error) {
        console.log(error);
    }
};

$scope.CancelPayment = async function () {
    try {

        const { data, error } = await OrdersService.updatePayment(
            $scope.selectedInvoice.id,
            'cancelled'
        );

        if (error) throw error;

        $scope.showPaymentModal = false;
        loadInvoices();
        
    } catch (error) {
        console.log(error);
    }
};

$scope.closePaymentModal = function (event) {
    if (event.target.classList.contains('med-modal-overlay')) {
        $scope.showPaymentModal = false;
    }
};
    loadInvoices();

}]);
