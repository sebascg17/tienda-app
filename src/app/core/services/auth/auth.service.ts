// core/services/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:5237/api/Usuarios';
  
  // Estado reactivo del usuario
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Al cargar la app, recuperamos datos del localStorage si existen
    const savedToken = localStorage.getItem('jwt_token');
    const savedRoles = JSON.parse(localStorage.getItem('user_roles') || '[]');
    if (savedToken) {
      this.currentUserSubject.next({ token: savedToken, roles: savedRoles });
    }
  }

  // Login Local (DB)
  loginLocal(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((res: any) => this.saveSession(res))
    );
  }
  // core/services/auth/auth.service.ts
  register(body: any, isAdmin: boolean = false): Observable<any> {
    const endpoint = isAdmin ? 'register-admin-temp' : 'register';
    return this.http.post(`${this.API_URL}/${endpoint}`, body);
  }

  // Guardar sesión de forma centralizada
  saveSession(response: any) {
    localStorage.setItem('jwt_token', response.token);
    localStorage.setItem('user_roles', JSON.stringify(response.roles || []));
    this.currentUserSubject.next(response);
  }

  // Helper para el Dispatcher
  getUserRoles(): string[] {
    return this.currentUserSubject.value?.roles || JSON.parse(localStorage.getItem('user_roles') || '[]');
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }
}