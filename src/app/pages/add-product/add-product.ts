import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css']
})
export class AddProduct {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Form Model
  product = {
    name: '',
    price: 0,
    image: '',
    condition: 'Fresh',
    quantity: 1,
    category: 'Vegetables',
    description: ''
  };

  isLoading = false;
  showToast = false;
  toastMessage = '';

  categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices', 'Machinery'];
  conditions = ['Fresh', 'Organic', 'Export Quality', 'Standard'];

  onSubmit() {
    if (!this.product.name || this.product.price <= 0 || this.product.quantity <= 0) {
      this.triggerToast('Please fill all required fields correctly.');
      return;
    }
    
    this.isLoading = true;
    
    this.http.post('https://backend-6fko.onrender.com/api/agriitems', this.product).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.triggerToast('✅ Product added successfully!');
        setTimeout(() => this.router.navigate(['/Products']), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error adding product', err);
        this.triggerToast('❌ Failed to add product. Check console.');
      }
    });
  }
    
  triggerToast(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }
}
