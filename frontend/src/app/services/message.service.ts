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

  //get all messages
  getAllMessages(): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.apiUrl);
  }
  
  //create a new message
  createMessage(message: IMessage): Observable<IMessage> {
    return this.http.post<IMessage>(this.apiUrl, message);
  }
  //update a message
  updateMessage(id: string, message: IMessage): Observable<IMessage> {
    return this.http.put<IMessage>(`${this.apiUrl}/${id}`, message);
  }
  
  //delete a message
  deleteMessage(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

  