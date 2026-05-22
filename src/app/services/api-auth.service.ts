import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, LoginDto, RegisterDto } from '../models/auth.model';

const API_BASE = 'https://backend-2a4l.onrender.com/api/auth'; 

@Injectable({ providedIn: 'root' })
export class ApiAuthService {

  constructor(private http: HttpClient) {}

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/login`, dto);
  }

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/register`, dto);
  }
}
