
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INotification } from '../utils/models';
import {NotRes} from '../utils/models';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

constructor(
  private http : HttpClient
) { }
  apiUrl = 'http://localhost:3000/api/notifications';


  //list of notifications
  listNotifications(): Observable<NotRes> {
    return this.http.get<NotRes>(this.apiUrl);
  }

  //mark notification as read
  markAsRead(id: string): Observable<INotification> {
    return this.http.put<INotification>(`${this.apiUrl}/${id}/read`, {});
  }
  
  //delete notification
  deleteNotification(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }


}
