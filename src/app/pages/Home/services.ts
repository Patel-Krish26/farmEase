
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [
    `
.ls-2 { letter-spacing: 2px; }
.leading-relaxed { line-height: 1.8; }

.services-section {
  background-color: transparent;
}

/* Service Card Styling */
.service-card {
  position: relative;
  cursor: pointer;
  z-index: 1;
  background: var(--bg-card) !important;
  border: 1px solid var(--border) !important;
  backdrop-filter: blur(20px);
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: rgba(34,197,94,0.1);
  color: var(--primary) !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.service-card:hover {
  transform: translateY(-12px);
  background: var(--bg-card-hover) !important;
  border-color: var(--primary) !important;
  box-shadow: var(--shadow-green) !important;
}

.service-card:hover .icon-wrapper {
  background: var(--primary);
  color: #ffffff !important;
  transform: rotateY(180deg);
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
}

.service-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(5px);
  color: var(--primary) !important;
}

/* Animations */
.animate-slide-up {
  opacity: 0;
  animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
}

.transition-all {
  transition: all 0.3s ease-in-out;
}
`,
  ],
  template: ` 
<section class="services-section mesh-bg py-5 position-relative overflow-hidden w-100">
  <div class="container py-4">

    <div class="row align-items-end mb-5 anim-fade-in">
      <div class="col-lg-6">
        <span class="badge badge-green px-3 py-2 mb-3 fw-bold text-uppercase ls-2">
          What We Offer
        </span>
        <h2 class="section-title text-white lh-sm">
          Empowering Modern Agriculture <br>
          <span class="gradient-text">Innovation & Marketplace</span>
        </h2>
      </div>

      <div class="col-lg-5 offset-lg-1 mt-4 mt-lg-0">
        <p class="text-muted fs-6 leading-relaxed mb-4">
          FarmEase brings together the latest agricultural news, expert insights,
          sustainable farming techniques, and a trusted marketplace to strengthen 
          modern agriculture for everyone.
        </p>
        <a routerLink="/About" class="btn-outline-glow rounded-pill px-4 py-2 fw-bold transition-all d-inline-block">
          Explore All Services <i class="fa-solid fa-arrow-right-long ms-2"></i>
        </a>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-3 col-md-6 animate-slide-up" 
           *ngFor="let service of services; let i = index"
           [style.animation-delay]="i * 0.1 + 's'">

        <div class="service-card h-100 p-4 rounded-4 shadow-sm transition-all glass">
          <div class="icon-wrapper mb-4 d-flex align-items-center justify-content-center rounded-4 shadow-sm text-primary">
            <i [class]="'fa-solid fs-3 ' + service.icon"></i>
          </div>

          <h5 class="fw-bold text-white mb-3">{{ service.title }}</h5>
          <p class="text-muted small mb-0 leading-normal">
            {{ service.desc }}
          </p>
          
          <div class="card-arrow mt-4 text-primary opacity-0 transition-all">
            <i class="fa-solid fa-circle-arrow-right fs-4"></i>
          </div>
        </div>

      </div>
    </div>

  </div>
</section>
`,
})
export class Services {
  services = [
    {
      icon: 'bi-newspaper',
      title: 'Agri News & Trends',
      desc: 'Stay updated with the latest agricultural news, market trends, and policy changes affecting modern farming.'
    },

    {
      icon: 'bi-shop',
      title: 'Agri Marketplace',
      desc: 'Buy and sell crops, seeds, fertilizers, and machinery through our trusted and farmer-friendly marketplace.'
    },
    {
      icon: 'bi-gear',
      title: 'Machinery Exchange',
      desc: 'Connect with verified suppliers to purchase or sell tractors, tools, and modern agricultural equipment.'
    },
    {
      icon: 'bi-people',
      title: 'Farmer Community',
      desc: 'Join a growing network of farmers and agri-enthusiasts to share knowledge, experiences, and opportunities.'
    }
  ];

}
