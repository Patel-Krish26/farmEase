import { Component, OnInit, inject, signal, computed } from "@angular/core";
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { forkJoin } from "rxjs";

interface Machinery {
  id: number;
  name: string;
  price: number;
  image: string;
  condition: string;
  quantity: number;
  category: string;
  description: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin implements OnInit {

  // ================= SIGNALS =================
  activePage = signal('dashboard');
  sidebarOpen = signal(false);
  isLoading = signal(true);

  farmers = signal<any[]>([]);
  customers = signal<any[]>([]);

  machineries = signal<any[]>([]);
  agriitems = signal<any[]>([]);

  isEditing = signal(false);
  editingId = signal<number | null>(null);

  isAddingUser = signal(false);

  currentAdminName = signal('');
  currentDate = signal(
    new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  );

  // ================= NORMAL STATE =================
  newMachinery: Machinery = {
    id: 0,
    name: '',
    price: 0,
    image: '',
    condition: '',
    quantity: 1,
    category: '',
    description: ''
  };

  newUser = {
    fullName: '',
    email: '',
    password: '',
    role: 'farmer',
    phone: '',
    address: ''
  };

  // ================= COMPUTED =================
  totalMachineryValue = computed(() =>
    this.machineries().reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
  );

  totalAgriValue = computed(() =>
    this.agriitems().reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
  );

  grandTotal = computed(() =>
    this.totalMachineryValue() + this.totalAgriValue()
  );

  // ================= INJECT =================
  private router = inject(Router);
  private http = inject(HttpClient);
  private backendUrl = 'https://backend-2a4l.onrender.com/api';

  constructor(public auth: AuthService) { }

  // ================= INIT =================
  ngOnInit(): void {
    this.checkAdminAccess();
    this.refreshUserLists();
    this.loadInventory();
  }

  // ================= AUTH =================
  checkAdminAccess(): void {
    const adminString = localStorage.getItem('CurrentUser');

    if (!adminString) {
      this.router.navigate(['/Login']);
      return;
    }

    const admin = JSON.parse(adminString);

    this.currentAdminName.set(admin.fullName || 'Admin');

    if (admin.role !== 'admin') {
      this.router.navigate(['/Login']);
    }
  }

  // ================= USERS =================
  refreshUserLists(): void {
    this.http.get<any[]>(`${this.backendUrl}/users`).subscribe({
      next: (allUsers) => {
        this.farmers.set(
          allUsers
            .filter(u => u.role === 'farmer')
            .map(u => this.formatUser(u))
        );

        this.customers.set(
          allUsers
            .filter(u => u.role === 'customer')
            .map(u => this.formatUser(u))
        );
      },
      error: err => console.error(err)
    });
  }

  private formatUser(u: any) {
    return {
      ...u,
      avatar:
        u.avatar ||
        `https://ui-avatars.com/api/?name=${u.fullName}&background=${u.role === 'farmer' ? '2e7d32' : '1e293b'}&color=fff`
    };
  }

  handleUserDelete(email: string): void {
    if (confirm('Delete this user?')) {
      this.http.delete(`${this.backendUrl}/users/${encodeURIComponent(email)}`)
        .subscribe(() => this.refreshUserLists());
    }
  }

  openAddUserModal(): void {
    this.isAddingUser.set(true);
  }

  closeAddUserModal(): void {
    this.isAddingUser.set(false);
  }

  submitNewUser(): void {
    if (!this.newUser.fullName || !this.newUser.email || !this.newUser.password) {
      alert('Fill required fields');
      return;
    }

    this.http.post(`${this.backendUrl}/auth/register`, this.newUser)
      .subscribe({
        next: () => {
          alert('User added');
          this.closeAddUserModal();
          this.refreshUserLists();
        }
      });
  }

  // ================= INVENTORY =================
  loadInventory(): void {
    this.isLoading.set(true);

    forkJoin({
      machinery: this.http.get<any[]>(`${this.backendUrl}/machinery`),
      agriitems: this.http.get<any[]>(`${this.backendUrl}/agriitems`)
    }).subscribe({
      next: (res) => {

        this.machineries.set([
          ...res.machinery.map(i => ({ ...i, source: 'admin' })),
          ...res.agriitems.map(i => ({ ...i, source: 'farmer' }))
        ]);

        this.agriitems.set(res.agriitems);

        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  // ================= CRUD =================
  handleItemAddOrUpdate(): void {
    if (!this.newMachinery.name || this.newMachinery.price <= 0) {
      alert('Fill required fields');
      return;
    }

    const id = this.editingId();

    if (this.isEditing() && id !== null) {

      // 🔥 detect correct API
      const endpoint =
        (this.newMachinery as any).source === 'farmer'
          ? 'agriitems'
          : 'machinery';

      this.http.put(`${this.backendUrl}/${endpoint}/${id}`, this.newMachinery)
        .subscribe({
          next: () => {
            console.log("Updated successfully");
            this.loadInventory();
            this.resetForm();
          },
          error: (err) => {
            console.error("Update failed", err);
            alert("Update failed");
          }
        });

    } else {

      // create only in admin machinery
      this.http.post(`${this.backendUrl}/machinery`, this.newMachinery)
        .subscribe({
          next: () => {
            console.log("Added successfully");
            this.loadInventory();
            this.resetForm();
          }
        });
    }
  }

  editItem(item: any): void {
    this.isEditing.set(true);
    this.editingId.set(item.id);

    // keep source (admin/farmer)
    this.newMachinery = { ...item };

    console.log("Editing Item:", item);
  }

  

  handleItemRemove(item: any): void {
    if (confirm('Delete this item?')) {

      const endpoint =
        item.source === 'farmer'
          ? 'agriitems'
          : 'machinery';

      this.http.delete(`${this.backendUrl}/${endpoint}/${item.id}`)
        .subscribe({
          next: () => {
            console.log("Deleted successfully");
            this.loadInventory();
          },
          error: () => alert("Delete failed")
        });
    }
  }


  resetForm(): void {
    this.newMachinery = {
      id: 0,
      name: '',
      price: 0,
      image: '',
      condition: '',
      quantity: 1,
      category: '',
      description: ''
    };

    this.isEditing.set(false);
    this.editingId.set(null);
  }

  // ================= UI =================
  setPage(page: string): void {
    this.activePage.set(page);
  }

  viewProduct(item: any): void {
    console.log(item);
  }
}
