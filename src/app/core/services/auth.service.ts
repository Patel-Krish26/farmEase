import { Injectable } from '@angular/core';

export type UserRole = 'admin' | 'farmer' | 'customer';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUser: { name: string; role: UserRole } | null = null;

  login(role: UserRole) {
    this.currentUser = { name: 'User', role };
    localStorage.setItem('user_role', role);
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('user_role');
    localStorage.removeItem('CurrentUser');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isLoggedIn(): boolean {
    return !!this.getRole();
  }

  getRole(): UserRole | null {
    return (localStorage.getItem('user_role') as UserRole) || null;
  }
}
