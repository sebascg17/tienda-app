// core/services/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { User, buildUserFromTokenPayload, buildUserFromDto, formatPhotoUrl } from '../../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:5237/api/Usuarios';

  // Estado reactivo del usuario
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Al cargar la app, recuperamos datos del localStorage si existen
    const savedToken = localStorage.getItem('jwt_token');
    const savedRoles = JSON.parse(localStorage.getItem('user_roles') || '[]');
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        const user = buildUserFromTokenPayload(payload);
        this.currentUserSubject.next(user);
      } catch {
        this.currentUserSubject.next(null);
      }
    }
  }

  // Obtener perfil del usuario autenticado
  getMe() {
    const token = localStorage.getItem('jwt_token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<any>(`${this.API_URL}/me`, { headers }).pipe(
      tap(dto => {
        if (dto) {
          const user = buildUserFromDto(dto);
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  // Actualizar perfil del usuario autenticado
  updateMyProfile(profileData: any) {
    const token = localStorage.getItem('jwt_token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.put<any>(`${this.API_URL}/me`, profileData, { headers }).pipe(
      tap(dto => {
        if (dto) {
          const user = buildUserFromDto(dto);
          this.currentUserSubject.next(user);
        }
      })
    );
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
    if (response?.token) {
      localStorage.setItem('jwt_token', response.token);
      localStorage.setItem('user_roles', JSON.stringify(response.roles || []));
      try {
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        const user = buildUserFromTokenPayload(payload);
        // If backend returns explicit nombre/apellido/photoUrl in response, prefer them
        if (response.nombre) user.nombre = response.nombre + (response.apellido ? (' ' + response.apellido) : '');
        if (response.apellido) user.apellido = response.apellido;
        if (response.photoUrl) user.photoUrl = formatPhotoUrl(response.photoUrl);

        this.currentUserSubject.next(user);
      } catch {
        this.currentUserSubject.next(null);
      }
    }
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