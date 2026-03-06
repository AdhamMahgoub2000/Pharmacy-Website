angular.module('pharmacyApp')
.controller('DashboardController', [
'$scope', '$location', 'MedicinesService', 'CustomersService', 'OrdersService',
function($scope, $location, MedicinesService, CustomersService, OrdersService) {

  $scope.loading = true;

  $scope.statCards = [];

  $scope.chartTab      = 'monthly';
  $scope.chartBars     = [];
  $scope.chartBarsData = { monthly: [], daily: [] };
  $scope.setChartTab   = function(tab) {
    $scope.chartTab  = tab;
    $scope.chartBars = $scope.chartBarsData[tab];
  };

  // ── Inventory alerts & recent invoices ────────────────────────────────
  $scope.inventoryAlerts = [];
  $scope.recentInvoices  = [];

  // ── Navigation ─────────────────────────────────────────────────────────
  $scope.goToInvoices  = function() { $location.path('/invoices');  };
  $scope.goToMedicines = function() { $location.path('/medicines'); };
  $scope.viewInvoice   = function(inv) { $location.path('/invoice/' + inv.rawId); };

  // ── Helpers ────────────────────────────────────────────────────────────
  function customerInitial(inv) {
    var name = inv.users && (inv.users.name || inv.users.email);
    return name ? name.charAt(0).toUpperCase() : '?';
  }
  function customerName(inv) {
    return (inv.users && (inv.users.name || inv.users.email)) || 'Unknown';
  }
  function formatCurrency(n) {
    return '$' + (n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // ── Build monthly chart from invoices ─────────────────────────────────
  function buildMonthlyChart(invoices) {
    var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
    var now    = new Date();
    var totals = {};

    invoices.forEach(function(inv) {
      var d = new Date(inv.created_at);
      if (d.getFullYear() !== now.getFullYear()) return;
      var key = d.getMonth();
      totals[key] = (totals[key] || 0) + (inv.total || 0);
    });

    var values = MONTHS.map(function(_,i){ return totals[i] || 0; });
    var max    = Math.max.apply(null, values.concat([1]));

    return MONTHS.map(function(m, i) {
      var val = totals[i] || 0;
      return {
        month:     m,
        height:    Math.round((val / max) * 90) + '%',
        highlight: i === now.getMonth(),
        value:     val
      };
    });
  }

  // ── Build daily chart (last 10 days) ──────────────────────────────────
  function buildDailyChart(invoices) {
    var now    = new Date();
    var labels = [];
    var totals = {};

    for (var i = 9; i >= 0; i--) {
      var d   = new Date(now);
      d.setDate(d.getDate() - i);
      var key = d.toISOString().slice(0, 10);
      labels.push({ key: key, label: (d.getMonth()+1) + '/' + d.getDate() });
      totals[key] = 0;
    }

    invoices.forEach(function(inv) {
      var key = new Date(inv.created_at).toISOString().slice(0, 10);
      if (totals[key] !== undefined) totals[key] += (inv.total || 0);
    });

    var values = labels.map(function(l){ return totals[l.key]; });
    var max    = Math.max.apply(null, values.concat([1]));

    return labels.map(function(l, i) {
      var val = totals[l.key] || 0;
      return {
        month:     l.label,
        height:    Math.round((val / max) * 90) + '%',
        highlight: i === labels.length - 1,
        value:     val
      };
    });
  }

  // ── Main data loader ───────────────────────────────────────────────────
  async function loadDashboard() {
    try {
      const [medicines, customers, invoices] = await Promise.all([
        MedicinesService.getAll(),
        CustomersService.getAllCustomers(),
        OrdersService.getAllInvoices()
      ]);

      // Stat calculations
      const totalMeds      = medicines.length;
      const totalCusts     = customers.length;
      const lowStock       = medicines.filter(m => m.stock >= 0 && m.stock < 20);
      const lowStockCnt    = lowStock.length;
      const today          = new Date().toISOString().slice(0, 10);
      const todayInvoices  = invoices.filter(i => i.created_at && i.created_at.slice(0,10) === today);
      const todayRevenue   = todayInvoices.reduce((s, i) => s + (i.total || 0), 0);
      const totalRevenue   = invoices.reduce((s, i) => s + (i.total || 0), 0);

      // Inventory alerts — worst low-stock first (max 4 items)
      const sortedLow = lowStock.slice().sort((a, b) => a.stock - b.stock).slice(0, 4);
      const alerts = sortedLow.map(function(m) {
        const critical = m.stock <= 5;
        return {
          cardClass:   critical ? 'critical' : 'warning',
          iconClass:   critical ? 'red'      : 'amber',
          icon:        'inventory_2',
          name:        m.name,
          detail:      'Stock: ' + m.stock + ' unit' + (m.stock !== 1 ? 's' : '') + ' remaining',
          status:      critical ? 'Critical Low' : 'Low Stock',
          statusClass: critical ? 'red' : 'amber'
        };
      });

      if (alerts.length === 0) {
        alerts.push({
          cardClass: 'info', iconClass: 'blue', icon: 'check_circle',
          name: 'All stock levels healthy',
          detail: 'No medicines are running low.',
          status: 'All Good', statusClass: 'gray'
        });
      }

      // Recent invoices — latest 5
      const recent = invoices.slice(0, 5).map(function(inv) {
        return {
          rawId:       inv.id,
          id:          '#' + inv.id.slice(0, 8).toUpperCase(),
          initials:    customerInitial(inv),
          customer:    customerName(inv),
          date:        new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          amount:      formatCurrency(inv.total),
          status:      inv.status,
          statusClass: inv.status
        };
      });

      $scope.$apply(function() {
        $scope.statCards = [
          {
            icon: 'pill', iconColor: 'blue',
            label: 'Total Medicines', value: totalMeds,
            badge: lowStockCnt > 0 ? lowStockCnt + ' low stock' : 'All healthy',
            badgeClass: lowStockCnt > 0 ? 'badge-warn' : 'badge-up', trend: null
          },
          {
            icon: 'group', iconColor: 'purple',
            label: 'Total Customers', value: totalCusts,
            badge: totalCusts + ' registered',
            badgeClass: 'badge-up', trend: null
          },
          {
            icon: 'payments', iconColor: 'green',
            label: "Today's Sales", value: formatCurrency(todayRevenue),
            badge: todayInvoices.length + ' order' + (todayInvoices.length !== 1 ? 's' : ''),
            badgeClass: 'badge-up', trend: null
          },
          {
            icon: 'warning', iconColor: 'red',
            label: 'Low Stock Alerts', value: lowStockCnt,
            badge: lowStockCnt > 0 ? 'Needs Attention' : 'All Clear',
            badgeClass: lowStockCnt > 0 ? 'badge-warn' : 'badge-up', trend: null
          },
        ];

        $scope.totalRevenue    = formatCurrency(totalRevenue);
        $scope.inventoryAlerts = alerts;
        $scope.recentInvoices  = recent;

        $scope.chartBarsData = { monthly: buildMonthlyChart(invoices), daily: buildDailyChart(invoices) };
        $scope.chartBars     = $scope.chartBarsData.monthly;
        $scope.loading       = false;
      });

    } catch (err) {
      console.error('Dashboard load error:', err);
      $scope.$apply(function() { $scope.loading = false; });
    }
  }

  loadDashboard();
}]);
