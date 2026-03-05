angular.module('pharmacyApp').controller('DashboardCtrl', function ($scope) {

    /* Chart tab toggle */
    $scope.chartTab     = 'monthly';
    $scope.setChartTab  = function (tab) { $scope.chartTab = tab; };

    /* Stat cards */
    $scope.statCards = [
      { icon: 'pill',     iconColor: 'blue',   badge: '2.4%',            badgeClass: 'badge-up',   trend: 'trending_up',   label: 'Total Medicines',  value: '1,240'     },
      { icon: 'group',    iconColor: 'purple', badge: '1.2%',            badgeClass: 'badge-down', trend: 'trending_down', label: 'Total Customers',  value: '850'       },
      { icon: 'payments', iconColor: 'green',  badge: '15.3%',           badgeClass: 'badge-up',   trend: 'trending_up',   label: "Today's Sales",    value: '$1,245.50' },
      { icon: 'warning',  iconColor: 'red',    badge: 'Needs Attention', badgeClass: 'badge-warn', trend: null,            label: 'Low Stock Alerts', value: '12'        },
    ];

    /* Bar chart data */
    $scope.chartBars = [
      { month: 'Jan', height: '40%', highlight: false },
      { month: 'Feb', height: '55%', highlight: false },
      { month: 'Mar', height: '45%', highlight: false },
      { month: 'Apr', height: '70%', highlight: false },
      { month: 'May', height: '95%', highlight: true  },
      { month: 'Jun', height: '60%', highlight: false },
      { month: 'Jul', height: '65%', highlight: false },
      { month: 'Aug', height: '50%', highlight: false },
      { month: 'Sep', height: '40%', highlight: false },
      { month: 'Oct', height: '55%', highlight: false },
    ];

    /* Inventory alerts */
    $scope.inventoryAlerts = [
      { cardClass: 'critical', iconClass: 'red',   icon: 'inventory_2', name: 'Amoxicillin 500mg', detail: 'Stock level: 5 units remaining',  status: 'Critical Low', statusClass: 'red'   },
      { cardClass: 'warning',  iconClass: 'amber', icon: 'inventory_2', name: 'Paracetamol 500mg', detail: 'Stock level: 24 units remaining', status: 'Warning',      statusClass: 'amber' },
      { cardClass: 'info',     iconClass: 'blue',  icon: 'history',     name: 'Stock Replenished', detail: 'Lisinopril added to inventory',   status: '2 hours ago',  statusClass: 'gray'  },
    ];

    /* Invoices table */
    $scope.invoices = [
      { id: '#INV-8821', initials: 'JD', customer: 'John Doe',      date: 'Oct 24, 2023', amount: '$124.00', status: 'Paid',    statusClass: 'paid'    },
      { id: '#INV-8822', initials: 'AM', customer: 'Alice Miller',  date: 'Oct 24, 2023', amount: '$45.50',  status: 'Pending', statusClass: 'pending' },
      { id: '#INV-8823', initials: 'RT', customer: 'Robert Taylor', date: 'Oct 23, 2023', amount: '$312.20', status: 'Paid',    statusClass: 'paid'    },
    ];
  });
