import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
// import jwtDecode from 'jwt-decode';
import { IUser } from '../utils/models'; // Adapt to your path

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; 
  private currentUserSubject = new BehaviorSubject<IUser | null>(this.getUserFromToken());

  constructor(private http: HttpClient, private router: Router) {}

  // Register a new user
  register(userData: Partial<IUser>): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        const user = this.getUserFromToken();
        this.currentUserSubject.next(user);
      })
    );
  }

  // Logoutcls
  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }


  getUserFromToken(): IUser | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    // console.log('decoded token:', decoded);

    const user: IUser = {
      _id: decoded.id,
      nom: decoded.nom,
      email: decoded.email,
      departement: decoded.departement,
      role: decoded.role
    };

    return user;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}


  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Observable for user state
  get currentUser$(): Observable<IUser | null> {
    return this.currentUserSubject.asObservable();
  }

  // Optional: get current user as value
  getCurrentUser(): IUser | null {
    return this.currentUserSubject.value;
  }

  // Optional: check role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
}
