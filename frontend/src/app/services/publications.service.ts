// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPublication } from '../utils/models';
@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

constructor(private http : HttpClient) { }

apiUrl = 'http://localhost:3000/api/publications';

//num of IPublications by type
getPublicationsCountByType(): Observable<Record<string, number>> {
  return this.http.get<Record<string, number>>(`${this.apiUrl}/count/pubsType`);
}




  // Créer une nouvelle IPublication
  createPublication(Publication: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, Publication);
  }

  // Récupérer toutes les IPublications (avec filtres optionnels)
  getPublications(filters?: { 
    departement?: string, 
    type?: string, 
    statut?: string 
  }): Observable<IPublication[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.departement) params = params.set('departement', filters.departement);
      if (filters.type) params = params.set('type', filters.type);
      if (filters.statut) params = params.set('statut', filters.statut);
    }

    return this.http.get<IPublication[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  // Récupérer une IPublication spécifique par son ID
  getPublication(id: string): Observable<IPublication> {
    return this.http.get<IPublication>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Mettre à jour une IPublication
  updatIPublication(id: string, updates: Partial<IPublication>): Observable<IPublication> {
    return this.http.put<IPublication>(`${this.apiUrl}/${id}`, updates, {
      headers: this.getAuthHeaders()
    });
  }

  // Supprimer une IPublication (soft delete)
  deletePublication(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Méthode utilitaire pour les headers d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}