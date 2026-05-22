import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink],
  standalone: true,
  template: `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

<section class="hero-wrapper overflow-hidden position-relative">
  <div class="bg-circle-1"></div>
  <div class="bg-circle-2"></div>

  <div class="container col-xxl-8 px-4 py-5 position-relative">
    <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
      
      <div class="col-10 col-sm-8 col-lg-6 animate__animated animate__fadeInRight">
        <div class="hero-img-container position-relative">
          <div class="image-glow"></div>
         
        </div>
      </div>
      
      <div class="col-lg-6">
        <div class="animate__animated animate__fadeInLeft">
          <span class="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 mb-3 animate__animated animate__bounceIn animate__delay-1s">
            <i class="fa-solid fa-bolt-lightning me-1"></i> New: AI Soil Analysis 2.0
          </span>
          <h1 class="display-3 fw-bold lh-1 mb-3 text-white">
            Farming Made <span class="text-success text-gradient">Intelligent.</span>
          </h1>
          <p class="lead mb-4 text-white">
            FarmEase simplifies the complexity of modern agriculture. From seed to sale, manage your entire operation with data-driven insights that increase yield and decrease stress.
          </p>
          
          <div class="d-grid gap-3 d-md-flex justify-content-md-start mb-5">
            <button type="button" routerLink="/Products" class="btn btn-success btn-lg px-5 rounded-pill btn-hover-grow fw-bold shadow-sm">
              Start Free Trial
            </button>
            <button type="button" routerLink="/About"class="btn btn-outline-warning btn-lg px-5 rounded-pill btn-hover-grow border-2">
              Explore Features
            </button>
          </div>
        </div>
        
        <div class="row pt-4 border-top border-light animate__animated animate__fadeInUp animate__delay-1s">
          <div class="col-4 border-end">
            <h3 class="fw-bold mb-0 text-success">25%</h3>
            <p class="text-light small fw-semibold text-uppercase ls-1">Yield Increase</p>
          </div>
          <div class="col-4 border-end">
            <h3 class="fw-bold mb-0 text-success">15k+</h3>
            <p class="text-light small fw-semibold text-uppercase ls-1">Active Farmers</p>
          </div>
          <div class="col-4">
            <h3 class="fw-bold mb-0 text-success">Zero</h3>
            <p class="text-light small fw-semibold text-uppercase ls-1">Hidden Fees</p>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</section>
  `,
  styles: [`
.hero-wrapper {
  background: url('https://agrezen.zozothemes.com/wp-content/uploads/2025/11/home-1-intro-3.webp') 
              no-repeat center center/cover;

  min-height: 80vh;
  z-index: 1;
}

/* Background Blobs */
.bg-circle-1 {
  position: absolute;
  top: -10%;
  right: -5%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(46, 125, 50, 0.08) 0%, transparent 70%);
  z-index: -1;
}

.bg-circle-2 {
  position: absolute;
  bottom: 10%;
  left: 5%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(129, 199, 132, 0.1) 0%, transparent 70%);
  z-index: -1;
}

/* Floating Image Animation */
.floating-anim {
  animation: floating 6s ease-in-out infinite;
}

@keyframes floating {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.image-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background: #2e7d32;
  filter: blur(80px);
  opacity: 0.15;
  z-index: -1;
}

/* Gradient Text */
.text-gradient {
  background: linear-gradient(135deg, #1b5e20, #43a047);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Button & Utilities */
.btn-hover-grow {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-hover-grow:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(46, 125, 50, 0.15);
}

.ls-1 { letter-spacing: 1px; }

/* Responsive adjustments */
@media (max-width: 991px) {
  .hero-wrapper { text-align: center; }
  .justify-content-md-start { justify-content: center !important; }
}
  `]
})
export class HeroSectionComponent {

  scrollTo() {
    document.getElementById('home')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

}
