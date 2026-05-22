import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface OrderItemDto {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface OrderDto {
  id: number;
  totalAmount: number;
  orderDate: string;
  status: string;
  items: OrderItemDto[];
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {
  private http = inject(HttpClient);
  private backendUrl = 'https://backend-6fko.onrender.com/api/orders';

  orders: OrderDto[] = [];
  activeFilter: string = 'All';
  filteredOrders: OrderDto[] = [];
  showToast = false;
  toastMessage = '';
  isLoading = true;

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.isLoading = true;
    this.http.get<OrderDto[]>(this.backendUrl).subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = [...this.orders];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.isLoading = false;
      }
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.filteredOrders = filter === 'All'
      ? [...this.orders]
      : this.orders.filter(o => o.status === filter);
  }

  statusColor(status: string): string {
    const map: any = {
      Delivered: '#22c55e',
      Completed: '#22c55e',
      Processing: '#fbbf24',
      Shipped: '#60a5fa',
      Cancelled: '#f87171'
    };
    return map[status] || '#9ca3af';
  }

  statusIcon(status: string): string {
    const map: any = {
      Delivered: 'fa-circle-check',
      Completed: 'fa-circle-check',
      Processing: 'fa-clock',
      Shipped: 'fa-truck',
      Cancelled: 'fa-circle-xmark'
    };
    return map[status] || 'fa-circle';
  }

  reorder(order: OrderDto) {
    this.notify(`Reorder for #${order.id} is not fully implemented yet.`);
  }

  cancelOrder(order: OrderDto) {
    this.notify(`Cancel order #${order.id} is not fully implemented yet.`);
  }

  downloadInvoice(order: OrderDto) {
    this.notify(`Invoice for #${order.id} downloaded.`);
  }

  private notify(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 2800);
  }
}
