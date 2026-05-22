import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private http = inject(HttpClient);
  private router = inject(Router);

  cartItems = this.cartService.items;
  subtotal  = this.cartService.subtotal;

  showToast = false;
  toastMessage = '';

  get shipping(): number { return this.cartService.count() > 0 ? 99 : 0; }
  get total():    number { return this.subtotal() + this.shipping; }
  get discount(): number { return Math.round(this.subtotal() * 0.05); }
  get finalTotal(): number { return this.total - this.discount; }

  updateQty(id: number, delta: number) { this.cartService.updateQty(id, delta); }

  removeItem(id: number) {
    this.cartService.removeItem(id);
    this.notify('Item removed from cart');
  }

  clearCart() {
    this.cartService.clearCart();
    this.notify('Cart cleared');
  }

  placeOrder() {
    if (this.cartService.count() === 0) return;
    const total = this.finalTotal;
    
    this.http.post('https://backend-6fko.onrender.com/api/orders', { checkoutFromCart: true }).subscribe({
      next: () => {
        this.cartService.clearLocalCart();
        this.notify(`✅ Order placed! Total ₹${total.toLocaleString('en-IN')} — Thank you!`);
        setTimeout(() => this.router.navigate(['/Orders']), 2000);
      },
      error: (err) => {
        console.error('Failed to place order:', err);
        this.notify('❌ Failed to place order. Please try again.');
      }
    });
  }

  private notify(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 2800);
  }

  ngOnInit(): void {}
}
