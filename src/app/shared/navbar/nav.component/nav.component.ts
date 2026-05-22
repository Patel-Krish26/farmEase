import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationEnd
} from '@angular/router';

import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../pages/wishlist/wishlist';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {

  isScrolled = false;
  currentUser: any = null;

  mobileMenuOpen = false;

  private routerSub!: Subscription;

  private router = inject(Router);
  private elRef = inject(ElementRef);

  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  cartCount = this.cartService.count;
  wishCount = this.wishlistService.count;

  constructor(public auth: AuthService) { }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {

    const clickedInside =
      this.elRef.nativeElement.contains(event.target);

    if (!clickedInside && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }

  ngOnInit() {
    this.updateUser();

    this.routerSub = this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.updateUser();

        // CLOSE MENU AFTER ROUTE CHANGE
        this.mobileMenuOpen = false;
      });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  toggleMobileMenu(event?: Event) {

    // PREVENT OUTSIDE CLICK INSTANT CLOSE
    event?.stopPropagation();

    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  updateUser() {
    const storedData = localStorage.getItem('CurrentUser');

    try {
      this.currentUser = storedData
        ? JSON.parse(storedData)
        : null;
    } catch (e) {
      this.currentUser = null;
    }
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  logout(): void {
    localStorage.removeItem('CurrentUser');

    this.auth.logout();

    this.cartService.clearLocalCart();
    this.wishlistService.clearLocalWishlist();

    this.currentUser = null;

    this.mobileMenuOpen = false;

    this.router.navigate(['/Login']);
  }
}
