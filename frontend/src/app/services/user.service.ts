import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(private http: HttpClient) { }
apiUrl = 'http://localhost:3000/api/users';
//num of users
getUserCount(): Observable<number> {
  return this.http.get<{ count: number }>(`${this.apiUrl}/count/all`).pipe(
    map(res => res.count)
  );
}
//get all users
// http://localhost:3000/api/users
getUsers(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl);
}

//get users with role en attente 
// http://localhost:3000/api/users?role=En attente
getUsersEnAttente(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}?role=En attente`);
}

//UPDATE user INFO
 updateUser(userId: string, data: { nom?: string; departement?: string; email?:string }): Observable<any> {
   return this.http.put<any>(`${this.apiUrl}/${userId}`, data);
    }

//PUT  http://localhost:3000/api/users/4b8f0f4e4b0c3a5d6f9e8c1
changeUserRole(userId: string, newRole: string): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${userId}`, { role: newRole });
}

// change user  department
changeUserDepartment(userId: string, newDepartment: string): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${userId}`, { department: newDepartment });
}

//get current user profile
getCurrentUser(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/me`);
}

//update current user profile
updateCurrentUser(data: { nom?: string; departement?: string; email?:string }): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/me`, data);
}

//delete user
deleteUser(userId: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${userId}`);
}


}
