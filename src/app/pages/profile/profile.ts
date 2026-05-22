import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './profile.html',
    styleUrls: ['./profile.css']
})
export class Profile implements OnInit {

    // ✅ SIGNAL
    currentUser = signal<any>(null);

    showEditModal = signal(false);
    isSaving = signal(false);
    saveSuccess = signal(false);
    saveError = signal('');

    editForm = {
        fullName: '',
        phone: '',
        address: '',
        dob: ''
    };

    private http = inject(HttpClient);

    ngOnInit(): void {
        this.loadCurrentUser();
    }

    // ✅ Load user
    private loadCurrentUser(): void {
        this.http.get<any>('https://backend-6fko.onrender.com/api/Users/me').subscribe({
            next: (user) => {
                this.currentUser.set(this.normalizeUserData(user));
            },
            error: (err) => {
                console.error('❌ Failed to load profile', err);
            }
        });
    }

    // ✅ Normalize
    private normalizeUserData(user: any): any {
        return {
            id: user.id,
            fullName: user.fullName || 'User',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            role: user.role || '',
            joinedDate: user.joinedDate || '',
            birthDate: user.birthDate || ''
        };
    }

// ===================== EDIT =====================

    editProfile(): void {
        const user = this.currentUser();
        if (!user) return;

        this.editForm = {
            fullName: user.fullName,
            phone: user.phone,
            address: user.address,
            dob: user.birthDate
        };

        this.saveError.set('');
        this.saveSuccess.set(false);
        this.showEditModal.set(true);
    }

    closeModal(): void {
        this.showEditModal.set(false);
        this.saveError.set('');
        this.saveSuccess.set(false);
    }

    saveProfile(): void {
        const user = this.currentUser();
        if (!user) return;

        if (!this.editForm.fullName.trim()) {
            this.saveError.set('Full name is required');
            return;
        }


        this.isSaving.set(true);

        const updatedUser = {
            ...user,
            fullName: this.editForm.fullName.trim(),
            phone: this.editForm.phone || '',
            address: this.editForm.address || '',
            birthDate: this.editForm.dob || ''
        };

        this.http.put(`https://backend-6fko.onrender.com/api/Users/${user.id}`, updatedUser).subscribe({
            next: () => {
                this.currentUser.set(updatedUser);
                this.finalizeSave();
            },
            error: () => {
                this.saveError.set('Update failed');
                this.isSaving.set(false);
            } 
        });
    }

    private finalizeSave(): void {
        this.isSaving.set(false);
        this.saveSuccess.set(true);

        setTimeout(() => {
            this.showEditModal.set(false);
            this.saveSuccess.set(false);
        }, 1200);
    }
}
