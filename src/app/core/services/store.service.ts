import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = `${environment.apiUrl}Tiendas`;

  constructor(private http: HttpClient) { }

  // Crear nueva tienda
  createStore(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Obtener mis tiendas
  getMyStores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-tiendas`);
  }
}
