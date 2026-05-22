import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgriItem } from '../models/agri-item.model';

const API_BASE = 'https://backend-6fko.onrender.com/api/agriitems';

@Injectable({ providedIn: 'root' })
export class AgriItemService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<AgriItem[]> {
    return this.http.get<AgriItem[]>(API_BASE);
  }

  getMyItems(): Observable<AgriItem[]> {
    return this.http.get<AgriItem[]>(`${API_BASE}/my-items`);
  }

  create(item: Partial<AgriItem>): Observable<AgriItem> {
    return this.http.post<AgriItem>(API_BASE, item);
  }

  update(id: number, item: Partial<AgriItem>): Observable<AgriItem> {
    return this.http.put<AgriItem>(`${API_BASE}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${id}`);
  }
}
