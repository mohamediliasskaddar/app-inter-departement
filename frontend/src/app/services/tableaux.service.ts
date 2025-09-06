// src/app/services/tableaux.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TableauxService {
  private apiUrl = 'http://localhost:3000/api/tableaux';

  constructor(private http: HttpClient) {}

  //  createTable(data: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/createOneShot`, data);
  // }

  // ✅ Create a full table in one shot
  createTableOneShot(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/one-shot`, data);
  }

  // ✅ Get all tables (with optional department filtering)
  getAllTables(departement?: string): Observable<any[]> {
    const params: any = {};
    if (departement) {
      params.departement = departement;
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // ✅ Get a single table by ID (fully populated)
  getTableById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // ✅ Update title or typeGraph of a table
  updateTable(id: string, data: Partial<{ titre: string; typeGraph: string }>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // ✅ Delete a table and all associated data (cascading delete)
  deleteTableCascade(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cascade/${id}`);
  }
  // ✅ update  existing cellule table
  updateCellule(cellId: string, data: { valeur: any }) {
  return this.http.put(`http://localhost:3000/api/valeurs/${cellId}`, data);
}


batchUpdateCells(updates: {cellId: string, valeur: any}[]) {
  const calls = updates.map(u => this.updateCellule(u.cellId, { valeur: u.valeur }));
  return forkJoin(calls);
}


}
