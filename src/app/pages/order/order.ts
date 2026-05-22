import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order.html',
  styleUrls: ['./order.css']
})
export class Orders implements OnInit {
  orders = [
    {
      id: 'FE-99210',
      date: 'Oct 12, 2025',
      total: 1250,
      status: 'Delivered',
      items: [
        { name: 'Organic Urea', qty: 1, price: 850 },
        { name: 'Hybrid Seeds', qty: 1, price: 400 }
      ]
    },
    {
      id: 'FE-99455',
      date: 'Feb 10, 2026',
      total: 3200,
      status: 'In Transit',
      items: [
        { name: 'Manual Seed Drill', qty: 1, price: 3200 }
      ]
    }
  ];

  getStatusClass(status: string) {
    switch (status) {
      case 'Delivered': return 'bg-success-subtle text-success';
      case 'In Transit': return 'bg-primary-subtle text-primary';
      case 'Cancelled': return 'bg-danger-subtle text-danger';
      default: return 'bg-secondary-subtle text-secondary';
    }
  }

  ngOnInit(): void { }
} 
