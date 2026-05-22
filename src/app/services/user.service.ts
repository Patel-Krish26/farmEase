import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const API_BASE = 'https://backend-6fko.onrender.com/api/users';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(API_BASE);
  }

  delete(email: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${encodeURIComponent(email)}`);
  }
}
