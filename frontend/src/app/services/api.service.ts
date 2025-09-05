import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class ApiService<T> {
  constructor(private http: HttpClient) {}

  getAll(url: string): Observable<T[]> {
    return this.http.get<T[]>(url);
  }

  getById(url: string, id: string): Observable<T> {
    return this.http.get<T>(`${url}/${id}`);
  }

  create(url: string, payload: Partial<T>): Observable<T> {
    return this.http.post<T>(url, payload);
  }

  update(url: string, id: string, payload: Partial<T>): Observable<T> {
    return this.http.put<T>(`${url}/${id}`, payload);
  }

  delete(url: string, id: string): Observable<void> {
    return this.http.delete<void>(`${url}/${id}`);
  }
  
}
