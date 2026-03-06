angular.module('pharmacyApp')
.directive('footerDirective', ['$rootScope', function($rootScope) {
  return {
    restrict: 'E',
    template: `

<!-- ═══════════════════════════════════════════════════
     CUSTOMER FOOTER  (shown only for customers)
════════════════════════════════════════════════════ -->
<footer class="pf-footer" ng-if="isCustomer()">

  <div class="pf-footer-top">
    <div class="container">
      <div class="row g-5">

        <!-- Brand -->
        <div class="col-lg-4 col-md-12">
          <div class="pf-brand d-flex align-items-center gap-3 mb-3">
            <div class="pf-brand-icon">
              <span class="material-symbols-outlined">health_and_safety</span>
            </div>
            <div>
              <h5 class="pf-brand-name">PharmaManage</h5>
              <p class="pf-brand-sub">Your Trusted Pharmacy</p>
            </div>
          </div>
          <p class="pf-desc">
            Providing authentic medicines and wellness products with fast delivery.
            Your health is our priority — shop safely and conveniently online.
          </p>
          <div class="pf-socials">
            <a href="#" class="pf-social-btn" title="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="pf-social-btn" title="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="pf-social-btn" title="Twitter / X">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="pf-social-btn" title="WhatsApp">
              <i class="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="col-lg-2 col-sm-6">
          <h6 class="pf-col-title">Quick Links</h6>
          <ul class="pf-link-list">
            <li><a href="#!/shop">Browse Medicines</a></li>
            <li><a href="#!/customers/{{currentUser.id}}">My Orders</a></li>
            <li><a href="#!/customers/{{currentUser.id}}">My Account</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        <!-- Services -->
        <div class="col-lg-3 col-sm-6">
          <h6 class="pf-col-title">Our Services</h6>
          <ul class="pf-link-list">
            <li>
              <span class="material-symbols-outlined pf-list-icon">local_shipping</span>
              Home Delivery
            </li>
            <li>
              <span class="material-symbols-outlined pf-list-icon">medication</span>
              Prescription Medicines
            </li>
            <li>
              <span class="material-symbols-outlined pf-list-icon">support_agent</span>
              24/7 Pharmacist Support
            </li>
            <li>
              <span class="material-symbols-outlined pf-list-icon">verified</span>
              Certified & Authentic Products
            </li>
            <li>
              <span class="material-symbols-outlined pf-list-icon">autorenew</span>
              Easy Returns & Refunds
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="col-lg-3 col-md-12">
          <h6 class="pf-col-title">Contact Us</h6>
          <div class="pf-contact-list">
            <div class="pf-contact-row">
              <div class="pf-contact-icon">
                <span class="material-symbols-outlined">location_on</span>
              </div>
              <span>122 Nile St, Dokki, Giza, Egypt</span>
            </div>
            <div class="pf-contact-row">
              <div class="pf-contact-icon">
                <span class="material-symbols-outlined">call</span>
              </div>
              <span>+20 11 0000 0000</span>
            </div>
            <div class="pf-contact-row">
              <div class="pf-contact-icon">
                <span class="material-symbols-outlined">mail</span>
              </div>
              <span>support@pharmacare.com</span>
            </div>
            <div class="pf-contact-row">
              <div class="pf-contact-icon">
                <span class="material-symbols-outlined">schedule</span>
              </div>
              <span>Sat – Thu &nbsp;·&nbsp; 9 AM – 10 PM</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- Bottom bar -->
  <div class="pf-footer-bottom">
    <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
      <span>© {{ currentYear }} PharmaManage. All rights reserved.</span>
      <div class="pf-bottom-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Refund Policy</a>
      </div>
    </div>
  </div>

</footer>


<!--  ADMIN FOOTER  (shown only for admins) -->
<footer class="pf-admin-footer" ng-if="isAdmin()">
  <div class="container-fluid">
    <div class="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">

      <div class="d-flex align-items-center gap-2">
        <div class="pf-admin-icon">
          <span class="material-symbols-outlined">health_and_safety</span>
        </div>
        <span class="pf-admin-brand">PharmaManage</span>
        <span class="pf-admin-sep">·</span>
        <span class="pf-admin-version">Admin Panel v1.0</span>
      </div>

      <div class="pf-admin-center d-none d-md-flex align-items-center gap-3">
        <div class="pf-admin-stat">
          <span class="material-symbols-outlined">shield</span>
          Secure Connection
        </div>
        <div class="pf-admin-sep">·</div>
        <div class="pf-admin-stat">
          <span class="material-symbols-outlined">support_agent</span>
          Support: support@pharmacare.com
        </div>
      </div>

      <span class="pf-admin-copy">© {{ currentYear }} PharmaManage. All rights reserved.</span>

    </div>
  </div>
</footer>

    `,
    controller: ['$scope', '$rootScope', function($scope, $rootScope) {
      $scope.currentYear = new Date().getFullYear();

      $scope.isCustomer = function() {
        var u = $rootScope.currentUser;
        return u && u.role === 'customer';
      };

      $scope.isAdmin = function() {
        var u = $rootScope.currentUser;
        return u && u.role === 'admin';
      };
    }]
  };
}]);
