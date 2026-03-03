angular.module("pharmacyApp")
.directive("footerDirective", function(){
    return {
        restrict: "E",
        template: `    <footer class="footer bg-white border-top mt-5">
  <div class="container py-5">
    <div class="row">

      <!-- Column 1: Brand -->
      <div class="col-md-4 mb-4">
        <div class="d-flex align-items-center mb-3 text-primary">
          <i class="fas fa-clinic-medical me-2 fs-4"></i>
          <h5 class="fw-bold mb-0">PharmaCare</h5>
        </div>

        <p class="text-muted small">
          Your trusted online pharmacy providing authentic medicines,
          wellness products, and professional pharmacist consultations.
          Fast delivery across Egypt.
        </p>

        <div class="d-flex gap-3 mt-3">
          <a href="#" class="text-muted fs-5"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="text-muted fs-5"><i class="fab fa-instagram"></i></a>
          <a href="#" class="text-muted fs-5"><i class="fab fa-twitter"></i></a>
        </div>
      </div>

      <!-- Column 2: Company -->
      <div class="col-md-2 mb-4">
        <h6 class="fw-bold mb-3">Company</h6>
        <ul class="list-unstyled small">
          <li><a href="#" class="text-muted text-decoration-none">About Us</a></li>
          <li><a href="#" class="text-muted text-decoration-none">Careers</a></li>
          <li><a href="#" class="text-muted text-decoration-none">Store Locator</a></li>
          <li><a href="#" class="text-muted text-decoration-none">Contact</a></li>
        </ul>
      </div>

      <!-- Column 3: Services -->
      <div class="col-md-3 mb-4">
        <h6 class="fw-bold mb-3">Services</h6>
        <ul class="list-unstyled small">
          <li><a href="#" class="text-muted text-decoration-none">Prescription Refill</a></li>
          <li><a href="#" class="text-muted text-decoration-none">Online Consultation</a></li>
          <li><a href="#" class="text-muted text-decoration-none">Health Packages</a></li>
          <li><a href="#" class="text-muted text-decoration-none">Home Delivery</a></li>
        </ul>
      </div>

      <!-- Column 4: Contact & Newsletter -->
      <div class="col-md-3 mb-4">
        <h6 class="fw-bold mb-3">Stay Updated</h6>
        <p class="text-muted small">
          Subscribe to receive health tips and exclusive offers.
        </p>

        <div class="input-group mb-3">
          <input type="email" class="form-control form-control-sm" placeholder="Enter your email">
          <button class="btn btn-primary btn-sm">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>

        <div class="small text-muted mt-3">
          <div><i class="fas fa-map-marker-alt me-2"></i> 122 Nile St, Dokki, Giza</div>
          <div><i class="fas fa-phone me-2"></i> +20 11 0000 0000</div>
          <div><i class="fas fa-envelope me-2"></i> support@pharmacare.com</div>
        </div>
      </div>

    </div>
  </div>

  <!-- Bottom -->
  <div class="border-top py-3">
    <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
      <span>© 2026 PharmaCare. All rights reserved.</span>

      <div class="d-flex gap-3 mt-2 mt-md-0">
        <a href="#" class="text-muted text-decoration-none">Privacy Policy</a>
        <a href="#" class="text-muted text-decoration-none">Terms</a>
        <a href="#" class="text-muted text-decoration-none">Refund Policy</a>
      </div>
    </div>
  </div>
</footer>`,
    }
});