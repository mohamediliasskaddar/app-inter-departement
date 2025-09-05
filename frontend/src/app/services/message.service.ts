import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMessage } from '../utils/models';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  // private apiUrl = '/api/messages';
private apiUrl = 'http://localhost:3000/api/messages';


  constructor(private http: HttpClient) { }

  getScheduledMessages(): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(`${this.apiUrl}?statut=programmée`);
  }
}
  