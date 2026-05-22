import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-us',
  imports:[RouterLink],
  standalone: true,
  template: `
<section class="about-section position-relative py-5 overflow-hidden mesh-bg" id="home">
  
  <h1 class="bg-watermark anim-fade-in">AGRO</h1>

  <div class="container position-relative z-index-2">
    <div class="row align-items-center g-5">

      <div class="col-lg-4 text-lg-start text-center mb-4 mb-lg-0 anim-slide-left">
        <div class="d-inline-block px-3 py-1 rounded-pill badge-green fw-bold small mb-3 ls-2 delay-1">
          EST. 2026
        </div>
        <h2 class="display-2 fw-bold lh-1 delay-2">
          <span class="text-primary">farm</span><span class="text-accent">Ease</span>
        </h2>
        <p class="text-muted fw-semibold mt-2 fs-5 ls-1 delay-3">Smart Farming, Simplified.</p>

        <a routerLink="/About"  class="btn-outline-glow rounded-pill px-5 py-2 mt-4 fw-bold shadow-sm delay-4 d-inline-block">
          More About Us
        </a>
      </div>

      <div class="col-lg-4 text-center mb-4 mb-lg-0 anim-fade-scale delay-2">
        <div class="image-wrapper position-relative">
          <div class="image-frame-decoration border-success"></div>
          <div class=" rounded-4 p-4  shadow-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI4OC4b1fzVXZMQ5iWSjoOgewgH513lqhbmg&s" class="img-fluid main-img anim-float" alt="Agro Excellence">
          </div>
        </div>
      </div>

      <div class="col-lg-4 text-lg-start text-center anim-slide-right delay-2">
        <div class="ps-lg-4 border-start-lg border-primary border-4 glass p-4 rounded-4">
          <p class="text-muted fs-6 leading-relaxed">
            <span class="fw-bold text-white">FarmEase</span> is your platform for modern agriculture, providing news,
            expert insights, and updates on trends, techniques, and sustainable
            practices to keep farmers and enthusiasts informed.
          </p>

          <p class="text-muted mt-4 fs-6 leading-relaxed">
            We offer a <span class="text-primary fw-semibold">trusted marketplace</span> for buying and selling
            agricultural products and machinery, connecting farmers and suppliers
            efficiently to support the global farming community.
          </p>
          
          <div class="mt-4 d-flex justify-content-center justify-content-lg-start gap-3">
             <div class="text-center glass-green p-3 rounded-3">
                <h4 class="fw-bold text-white mb-0">100%</h4>
                <small class="text-primary fw-bold small">Secure</small>
             </div>
             <div class="text-center glass-green p-3 rounded-3">
                <h4 class="fw-bold text-white mb-0">Direct</h4>
                <small class="text-primary fw-bold small">Market</small>
             </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
  `,
  styles: [ `
.about-section {
  background-color: transparent;
}

/* Background Watermark */
.bg-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 25vw;
  font-weight: 900;
  color: rgba(34, 197, 94, 0.05); /* Extremely subtle green */
  z-index: 1;
  pointer-events: none;
  letter-spacing: -10px;
}

.ls-1 { letter-spacing: 1px; }
.ls-2 { letter-spacing: 2px; }
.z-index-2 { z-index: 2; }

/* Image Frame Decoration */
.image-wrapper {
  padding: 15px;
}

.image-frame-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid var(--primary);
  border-radius: 25px;
  transform: rotate(-3deg);
  z-index: -1;
  box-shadow: var(--shadow-green);
}

.main-img {
  transition: transform 0.5s ease;
  border-radius: 15px;
}

/* Responsive Border */
@media (min-width: 992px) {
  .border-start-lg {
    border-left: 4px solid var(--primary) !important;
  }
}

.leading-relaxed {
  line-height: 1.8;
}
  `]
})
export class AboutUsComponent { }
