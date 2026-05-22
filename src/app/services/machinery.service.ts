import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Machinery } from '../models/machinery.model';

const API_BASE = 'https://backend-2a4l.onrender.com/api/machinery';

@Injectable({ providedIn: 'root' })
export class MachineryService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Machinery[]> {
    return this.http.get<Machinery[]>(API_BASE);
  }

  create(machinery: Partial<Machinery>): Observable<Machinery> {
    return this.http.post<Machinery>(API_BASE, machinery);
  }

  update(id: number, machinery: Partial<Machinery>): Observable<Machinery> {
    return this.http.put<Machinery>(`${API_BASE}/${id}`, machinery);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${id}`);
  }
}
