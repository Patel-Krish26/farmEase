import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../wishlist/wishlist';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  auth = inject(AuthService);
  router = inject(Router);
  http = inject(HttpClient);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }
  }

  login(email: string, password: string) {

    email = email.trim();
    password = password.trim();

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    const backendUrl = 'https://backend-6fko.onrender.com/api/auth';

    this.http.post(`${backendUrl}/login`, { email, password }).subscribe({
      next: (foundUser: any) => {
        // Save current logged in user
        localStorage.setItem('CurrentUser', JSON.stringify(foundUser));

        // ✅ Pass role if required
        this.auth.login(foundUser.role);
        
        // Refresh cart and wishlist upon login
        this.cartService.refreshCart();
        this.wishlistService.refreshWishlist();

        // Optional: Redirect by role
        this.redirectByRole(foundUser.role);
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Invalid email or password');
      }
    });
  }

  private redirectByRole(role: string) {
    if (role === 'farmer') {
      this.router.navigate(['/']);
    } else if (role === 'customer') {
      this.router.navigate(['/']);
    } else if (role === 'admin') {
      this.router.navigate(['/admin/Admin']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
