import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FileUploadService } from '../../../core/services/file-upload.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  // Datos del usuario
  userName: string = '';
  userEmail: string = '';
  userId: string = ''; // Para usar como carpeta en el servidor
  birthDate: string = '';
  profilePhoto: string | null = null;
  previewPhoto: string | null = null;
  previewFile: File | null = null;

  // Estados
  isLoading: boolean = false;
  isSaving: boolean = false;
  isUploading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private i18nService: I18nService,
    private authService: AuthService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  /**
   * Cargar datos del usuario desde el token JWT
   * Arquitectura escalable: obtiene userId para organizar uploads en el servidor
   */
  loadUserProfile(): void {
    this.isLoading = true;
    try {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload.unique_name || payload.email || '';
        this.userEmail = payload.email || payload.sub || '';
        // Extraer ID del usuario del token (escalable: el servidor organiza por userId)
        this.userId = payload.id || payload.sub || 'default';

        // Obtener foto del perfil desde el payload si existe
        if (payload.profilePhotoUrl) {
          this.profilePhoto = payload.profilePhotoUrl;
        }
      }

      this.isLoading = false;
    } catch (error) {
      console.error('Error cargando perfil:', error);
      this.isLoading = false;
    }
  }

  /**
   * Manejo de cambio de foto de perfil
   * Crea preview local sin subir aún
   */
  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Solo se permiten imágenes';
        setTimeout(() => (this.errorMessage = ''), 3000);
        return;
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'La imagen no debe superar 5MB';
        setTimeout(() => (this.errorMessage = ''), 3000);
        return;
      }

      this.previewFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewPhoto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Guardar cambios de perfil
   * Arquitectura escalable: sube archivo al servidor (local o futuro Azure)
   */
  saveProfile(): void {
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Si hay nuevo archivo, subirlo primero
    if (this.previewFile) {
      this.isUploading = true;

      this.fileUploadService.uploadProfilePhoto(this.previewFile, this.userId).subscribe(
        (response) => {
          this.isUploading = false;

          if (response.success && response.filePath) {
            // Guardar la ruta relativa devuelta por el servidor
            this.profilePhoto = response.filePath;

            // Guardar en sessionStorage temporalmente hasta que se actualice el token
            sessionStorage.setItem('user_profile_photo', response.filePath);

            // Aquí iría la llamada a API para actualizar el perfil con la nueva foto
            this._completeProfileSave();
          } else {
            this.errorMessage = 'Error al subir la foto';
            this.isSaving = false;
            setTimeout(() => (this.errorMessage = ''), 3000);
          }
        },
        (error) => {
          this.isUploading = false;
          this.isSaving = false;
          console.error('Error uploading file:', error);
          this.errorMessage = 'Error al subir la foto. Intenta de nuevo.';
          setTimeout(() => (this.errorMessage = ''), 3000);
        }
      );
    } else {
      // Si no hay nuevo archivo, solo guardar otros datos
      this._completeProfileSave();
    }
  }

  /**
   * Completar guardado de perfil
   * Escalable: aquí iría la llamada a API para sincronizar todos los datos
   */
  private _completeProfileSave(): void {
    const profileData = {
      nombre: this.userName,
      fechaNacimiento: this.birthDate,
      fotoPerfilUrl: this.profilePhoto,
    };

    // TODO: Implementar llamada a API
    // this.apiService.updateProfile(profileData).subscribe(
    //   (response) => {
    //     this.isSaving = false;
    //     this.successMessage = this.i18nService.translate('messages.success');
    //     this.previewPhoto = null;
    //     this.previewFile = null;
    //     setTimeout(() => (this.successMessage = ''), 3000);
    //   },
    //   (error) => {
    //     this.isSaving = false;
    //     this.errorMessage = this.i18nService.translate('messages.error');
    //   }
    // );

    // Por ahora, simular guardado
    setTimeout(() => {
      this.isSaving = false;
      this.successMessage = this.i18nService.translate('messages.success');
      this.previewPhoto = null;
      this.previewFile = null;

      // Dispara evento para que main-layout se entere del cambio
      window.dispatchEvent(new CustomEvent('profileUpdated', {
        detail: { profilePhotoUrl: this.profilePhoto }
      }));

      setTimeout(() => (this.successMessage = ''), 3000);
    }, 500);
  }

  /**
   * Cancelar edición
   */
  cancelEdit(): void {
    this.previewPhoto = null;
    this.previewFile = null;
    this.loadUserProfile();
  }
}
