import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  // Endpoint: GET /api/geografia/paises
  getPaises(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}geografia/paises`);
  }

  // Endpoint: GET /api/geografia/departamentos/{paisId}
  getDepartamentos(paisId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}geografia/departamentos/${paisId}`);
  }

  // Endpoint: GET /api/geografia/municipios/{departamentoId}
  getMunicipios(departamentoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}geografia/municipios/${departamentoId}`);
  }
}
