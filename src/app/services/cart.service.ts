import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
}

// Map the backend model to the frontend structure where possible
@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private backendUrl = 'https://backend-6fko.onrender.com/api/cart';

  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly count = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

  constructor() {
    this.refreshCart();
  }

  refreshCart() {
    if (!localStorage.getItem('CurrentUser')) return;

    this.http.get<CartItem[]>(this.backendUrl).subscribe({
      next: (items) => {
        // Map to expected structure if needed, or use directly
        this._items.set(items.map(i => ({
          id: i.id,
          productId: i.productId,
          productName: i.productName,
          name: i.productName, // for compatibility with existing templates
          price: i.price,
          quantity: i.quantity,
          image: i.imageUrl, // for compatibility with existing templates
          imageUrl: i.imageUrl,
          category: i.category
        } as any)));
      },
      error: (err) => console.error('Failed to fetch cart', err)
    });
  }

  addItem(product: any) {

    const productId = Number(product.productId || product.id);

    // FIND EXISTING PRODUCT
    const existingItem = this._items().find(
      item => Number(item.productId) === productId
    );

    // PRODUCT ALREADY EXISTS
    if (existingItem) {

      const updatedQty =
        Number(existingItem.quantity) +
        Number(product.quantity || 1);

      this.http.put(
        `${this.backendUrl}/${existingItem.id}`,
        {
          quantity: updatedQty
        }
      ).subscribe({

        next: () => {
          this.refreshCart();
        },

        error: (err) => {
          console.error('Failed to update quantity', err);
        }
      });

      return;
    }

    // CREATE NEW PRODUCT
    const dto = {

      productId: productId,

      productName:
        product.productName ||
        product.name ||
        product.title,

      price: Number(product.price),

      quantity: Number(product.quantity || 1),

      imageUrl:
        product.imageUrl ||
        product.image,

      category:
        product.category ||
        product.subtitle
    };

    this.http.post<CartItem>(
      this.backendUrl,
      dto
    ).subscribe({

      next: () => {
        this.refreshCart();
      },

      error: (err) => {

        console.error('Failed to add cart item', err);

        if (err.status === 401) {
          alert('Please log in to use the Cart.');
        }
      }
    });
  }

  updateQty(id: number, delta: number) {
    const item = this._items().find(i => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      this.removeItem(id);
      return;
    }

    this.http.put(`${this.backendUrl}/${id}`, { quantity: newQty }).subscribe({
      next: () => this.refreshCart(),
      error: (err) => console.error('Failed to update cart quantity', err)
    });
  }

  removeItem(id: number) {

    this.http.delete(`${this.backendUrl}/${id}`).subscribe({

      next: () => {

        this._items.update(items =>
          items.filter(i => i.id !== id)
        );

        this.refreshCart();
      },

      error: (err) =>
        console.error('Failed to remove cart item', err)
    });
  }

  clearCart() {
    this.http.delete(`${this.backendUrl}/clear`).subscribe({
      next: () => this._items.set([]),
      error: (err) => console.error('Failed to clear cart', err)
    });
  }

  clearLocalCart() {
    this._items.set([]);
  }

  isInCart(productId: number) {

    return this._items().some(
      i => Number(i.productId) === Number(productId)
    );
  }
}
