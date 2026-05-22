import { Injectable, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  name?: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private http = inject(HttpClient);
  private backendUrl = 'https://backend-6fko.onrender.com/api/wishlist';

  private _items = signal<WishlistItem[]>([]);
  readonly items = this._items.asReadonly();
  
  readonly count = computed(() => this._items().length);
  readonly total = computed(() => this._items().reduce((acc, i) => acc + i.price, 0));

  constructor() {
    this.refreshWishlist();
  }

  refreshWishlist() {
    if (!localStorage.getItem('CurrentUser')) return;

    this.http.get<WishlistItem[]>(this.backendUrl).subscribe({
      next: (items) => {
        this._items.set(items.map(i => ({
          ...i,
          name: i.productName // Map for frontend compatibility
        })));
      },
      error: (err) => console.error('Failed to fetch wishlist', err)
    });
  }

  addItem(item: any) {
    const dto = {
      productId: item.id || item.productId,
      productName: item.name || item.title,
      price: item.price,
      imageUrl: item.imageUrl || item.image,
      inStock: item.inStock !== false,
      category: item.category || item.subtitle
    };

    this.http.post<WishlistItem>(this.backendUrl, dto).subscribe({
      next: () => this.refreshWishlist(),
      error: (err) => {
        console.error('Failed to add to wishlist', err);
        if (err.status === 401) alert('Please log in to use the Wishlist.');
      }
    });
  }

  remove(id: number) {

    this.http.delete(`${this.backendUrl}/${id}`).subscribe({

      next: () => {

        this._items.update(items =>
          items.filter(i => i.id !== id)
        );

        this.refreshWishlist();
      },

      error: (err) =>
        console.error('Failed to remove from wishlist', err)
    });
  }

  isInWishlist(productId: number): boolean {

    return this._items().some(
      i => Number(i.productId) === Number(productId)
    );
  }

  clear() {
    this.http.delete(`${this.backendUrl}/clear`).subscribe({
      next: () => this._items.set([]),
      error: (err) => console.error('Failed to clear wishlist', err)
    });
  }

  clearLocalWishlist() {
    this._items.set([]);
  }
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);

  wishlistItems = this.wishlistService.items;
  totalValue = this.wishlistService.total;

  // Toast
  showToast = false;
  toastMessage = '';

  inStockCount = computed(() =>
    this.wishlistItems().filter(i => i.inStock).length
  );

  ngOnInit() {
    this.wishlistService.refreshWishlist();
  }

  removeItem(id: number) {
    this.wishlistService.remove(id);
    this.showNotification('Removed from wishlist');
  }

  moveToCart(item: WishlistItem) {
    this.cartService.addItem(item);
    this.wishlistService.remove(item.id);
    this.showNotification(`${item.productName || item.name} moved to cart!`);
  }

  moveAllToCart() {
    const inStock = this.wishlistItems().filter(i => i.inStock);
    inStock.forEach(item => {
      this.cartService.addItem(item);
      this.wishlistService.remove(item.id);
    });
    this.showNotification(`${inStock.length} item${inStock.length > 1 ? 's' : ''} moved to cart!`);
  }

  trackById(index: number, item: WishlistItem) { return item.id; }

  private showNotification(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 2800);
  }
}
