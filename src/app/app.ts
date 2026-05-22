import {
  Component,
  AfterViewInit,
  NgZone,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

import { isPlatformBrowser, CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { NavComponent } from './shared/navbar/nav.component/nav.component';
import { FooterComponent } from './shared/footer/footer.component/footer.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit {

  showIntro = true;

  // TOAST
  showToast = false;
  toastMessage = '';

  @ViewChild('mainWrapper') mainWrapper!: ElementRef;

  constructor(
    public auth: AuthService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    if (isPlatformBrowser(this.platformId)) {

      // CHECK IF INTRO ALREADY PLAYED
      const introPlayed = localStorage.getItem('introPlayed');

      if (introPlayed) {
        this.showIntro = false;
      }

      // Scroll to top on route change
      this.router.events.subscribe(event => {

        if (event instanceof NavigationEnd) {

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });

        }
      });
    }
  }

  ngAfterViewInit(): void {

    if (!isPlatformBrowser(this.platformId)) return;

    // SKIP INTRO IF ALREADY PLAYED
    if (!this.showIntro) return;

    this.ngZone.runOutsideAngular(() => {

      requestAnimationFrame(() => {

        setTimeout(() => {

          const stage = document.getElementById('stage');

          if (stage) {

            stage.classList.add('is-active');

            setTimeout(() => {

              this.ngZone.run(() => {

                this.showIntro = false;

                // SAVE INTRO STATE FOREVER
                localStorage.setItem('introPlayed', 'true');

                this.cdr.detectChanges();

              });

            }, 1800);
          }

        }, 50);

      });

    });
  }

  // GLOBAL TOAST METHOD
  showGlobalToast(message: string): void {

    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => {

      this.showToast = false;

    }, 2000);
  }
}
