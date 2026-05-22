import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { WishlistService, WishlistItem } from '../wishlist/wishlist';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  // ✅ SIGNALS
  isLoading = signal(true);
  products = signal<any[]>([]);
  selectedProduct = signal<any | null>(null);
  selectedQty = signal(1);
  toastMessage = signal('');
  showToast = signal(false);

  private toastTimer: any = null;

  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  auth = inject(AuthService);

  ngOnInit(): void {
    this.refreshProducts();
  }

  refreshProducts(): void {
    this.isLoading.set(true);
    this.products.set([]);

    forkJoin({
      machinery: this.http.get<any[]>('https://backend-2a4l.onrender.com/api/machinery'),
      agriitems: this.http.get<any[]>('https://backend-2a4l.onrender.com/api/agriitems')
    }).subscribe({
      next: (res) => {
        const allItems = [...res.machinery, ...res.agriitems];

        const mapped = allItems.map(item => ({
          id: item.id,
          title: item.name || 'Untitled Product',
          subtitle: item.category || 'Product Category',
          description: item.description || `High-quality ${item.name} available now.`,
          imageUrl: item.image || '',
          label: item.quantity > 0 ? 'In Stock' : 'Out of Stock',
          inStock: item.quantity > 0,
          metaText: `₹${item.price}`,
          price: item.price,
          quantity: item.quantity,
          action: () => this.viewProduct(item)
        }));

        this.products.set(mapped);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch:', err);
        this.isLoading.set(false);
      }
    });
  }

  // ── CART ──
  addToCart(product: any, qty = 1) {

    if (this.cartService.isInCart(product.id)) {
      this.showNotification(`🛒 Already in cart`);
      return;
    }

    this.cartService.addItem({
      productId: product.id,
      productName: product.title,
      name: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      image: product.imageUrl,
      quantity: qty,
      category: product.subtitle,
    });

    this.showNotification(`✅ ${product.title} added to cart`);
  }

  isInCart(id: number) {
    return this.cartService.isInCart(id);
  }

  // ── WISHLIST ──
  toggleWishlist(product: any) {

    const existingItem = this.wishlistService
      .items()
      .find(i => i.productId === product.id);

    if (existingItem) {

      this.wishlistService.remove(existingItem.id);

      this.showNotification(`💔 Removed from wishlist`);

    } else {

      this.wishlistService.addItem({
        productId: product.id,
        name: product.title,
        productName: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        inStock: product.inStock,
        category: product.subtitle
      } as WishlistItem);

      this.showNotification(`❤️ ${product.title} saved to wishlist`);
    }
  }

  isInWishlist(id: number) {
    return this.wishlistService.isInWishlist(id);
  }

  // ── MODAL ──
  viewProduct(product: any) {
    this.selectedProduct.set(product);
    this.selectedQty.set(1);
  }

  closeModal() {
    this.selectedProduct.set(null);
  }

  addModalToCart() {
    this.addToCart(this.selectedProduct(), this.selectedQty());
    this.closeModal();
  }

  // ── TOAST ──
  showNotification(msg: string) {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastMessage.set(msg);
    this.showToast.set(true);

    this.toastTimer = setTimeout(() => {
      this.showToast.set(false);
    }, 2800);
  }

  // ── CONTACT LINKS ──
  getWhatsAppLink(product: any): string {
    const phone = '918238775747';
    const text = encodeURIComponent(`Hello! I'm interested in your product on FarmEase: ${product.title}`);
    return `https://wa.me/${phone}?text=${text}`;
  }

  getPhoneLink(): string {
    return 'tel:+918238775747';
  }

  getTelegramSupport(): string {
    const text = encodeURIComponent(`Telegram Suport!`);
    return `https://web.telegram.org/a/#7198886077?text=${text}`;
  }

  getMailLink(product: any): string {
    const email = 'krishpr2004@gmail.com';
    const subject = encodeURIComponent(`FarmEase Inquiry: ${product.title}`);
    const body = encodeURIComponent(`Hi,\n\nI found your ${product.title} on FarmEase and would like to know more...`);
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }

}
