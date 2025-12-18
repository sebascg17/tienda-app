import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Interface para respuesta de upload
 * Escalable para soportar múltiples proveedores (Local, Azure, AWS, etc.)
 */
export interface UploadResponse {
  success: boolean;
  message: string;
  filePath?: string;  // Ruta relativa: /assets/uploads/profiles/userId/filename.jpg
  fileUrl?: string;   // URL completa (para Azure sería https://storage.azure.com/...)
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = `${environment.apiUrl}/api/upload`;

  constructor(private http: HttpClient) { }

  /**
   * Subir foto de perfil del usuario
   * Escalable: el backend puede cambiar el proveedor sin afectar el cliente
   * 
   * @param file - Archivo a subir
   * @param userId - ID del usuario (para organizar en carpetas)
   * @returns Observable con respuesta del servidor
   */
  uploadProfilePhoto(file: File, userId: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('uploadType', 'profile'); // Tipo de upload para determinar carpeta

    return this.http.post<UploadResponse>(`${this.apiUrl}/profile-photo`, formData);
  }

  /**
   * Método genérico para subir cualquier archivo
   * Escalable para futuros tipos de uploads (documentos, productos, etc.)
   * 
   * @param file - Archivo a subir
   * @param uploadType - Tipo de upload ('profile', 'document', 'product', etc.)
   * @param metadata - Datos adicionales específicos del tipo de upload
   * @returns Observable con respuesta del servidor
   */
  uploadFile(
    file: File,
    uploadType: 'profile' | 'document' | 'product' | 'other',
    metadata?: { [key: string]: any }
  ): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadType', uploadType);

    if (metadata) {
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });
    }

    return this.http.post<UploadResponse>(`${this.apiUrl}/file`, formData);
  }

  /**
   * Eliminar archivo (para limpiar al cambiar foto)
   * Escalable: el backend maneja lógica de ambos proveedores
   * 
   * @param filePath - Ruta relativa del archivo
   * @returns Observable
   */
  deleteFile(filePath: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/file`, {
      params: { filePath }
    });
  }
}
