import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { NotificationService } from '../../../core/services/notification.service';

import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, AvatarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  // Datos del usuario
  userFirstName: string = '';
  userLastName: string = '';
  userEmail: string = '';
  userId: string = ''; // Para usar como carpeta en el servidor
  birthDate: string = '';
  profilePhoto: string | null = null;
  previewPhoto: string | null = null;
  previewFile: File | null = null;
  private initialState: any = null;

  private userSubscription!: Subscription;

  // API base URL para construir rutas de archivos
  private apiBaseUrl = 'http://localhost:5237';

  // Estados
  isLoading: boolean = false;
  isSaving: boolean = false;
  isUploading: boolean = false;
  isSavingAttempted: boolean = false;

  constructor(
    private i18nService: I18nService,
    private authService: AuthService,
    private fileUploadService: FileUploadService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Suscribirse al estado del usuario (Centralizado en AuthService)
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        // Solo inicializar si el formulario está vacío (opcional) 
        // o si queremos que refleje cambios externos siempre:
        this.userFirstName = user.nombre || '';
        this.userLastName = user.apellido || '';
        this.userEmail = user.email || '';
        this.userId = user.id?.toString() || '';

        // Manejar URL de la foto
        if (user.photoUrl) {
          this.profilePhoto = user.photoUrl.startsWith('http')
            ? user.photoUrl
            : `${this.apiBaseUrl}${user.photoUrl}`;
        } else {
          this.profilePhoto = null;
        }

        // Fecha de nacimiento
        if (user.fechaNacimiento) {
          const dateObj = new Date(user.fechaNacimiento);
          if (!isNaN(dateObj.getTime())) {
            this.birthDate = dateObj.toISOString().split('T')[0];
          }
        }
        console.log('Perfil sincronizado reactivamente:', user);

        // Guardar estado inicial para detección de cambios
        if (!this.initialState) {
          this.initialState = {
            nombre: this.userFirstName,
            apellido: this.userLastName,
            fechaNacimiento: this.birthDate,
            photoUrl: user.photoUrl
          };
        }
      }
    });

    // Cargar datos frescos por si acaso
    this.authService.getMe().subscribe();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /**
   * Cargar datos del usuario desde el token JWT
   * Arquitectura escalable: obtiene userId para organizar uploads en el servidor
   */
  loadUserProfile(): void {
    this.isLoading = true;

    // Llamar al backend para obtener datos frescos del usuario
    this.authService.getMe().subscribe({
      next: (userData) => {
        // Actualizar datos del usuario desde el backend
        this.userFirstName = userData.nombre || '';
        this.userLastName = userData.apellido || '';
        this.userEmail = userData.email || '';
        this.userId = userData.id?.toString() || '';

        // Asignar fecha de nacimiento si existe
        if (userData.fechaNacimiento) {
          // El input type="date" espera formato YYYY-MM-DD
          const dateObj = new Date(userData.fechaNacimiento);
          if (!isNaN(dateObj.getTime())) {
            this.birthDate = dateObj.toISOString().split('T')[0];
          }
        }

        // Actualizar foto del perfil
        if (userData.photoUrl) {
          const fullUrl = userData.photoUrl.startsWith('http')
            ? userData.photoUrl
            : `${this.apiBaseUrl}${userData.photoUrl}`;
          this.profilePhoto = fullUrl;
          sessionStorage.setItem('user_profile_photo', fullUrl);
        }

        this.isLoading = false;
        console.log('Perfil cargado desde el backend:', userData);
      },
      error: (err) => {
        console.error('Error cargando perfil desde el backend:', err);
        this.isLoading = false;

        // Fallback: intentar leer del token si falla el backend
        try {
          const token = localStorage.getItem('jwt_token');
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            this.userFirstName = payload.nombre || '';
            this.userLastName = payload.apellido || '';
            this.userEmail = payload.email || payload.sub || '';
            this.userId = payload.id || '';
          }
        } catch (tokenError) {
          console.error('Error leyendo token como fallback:', tokenError);
        }
      }
    });
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
        this.notificationService.showError('Solo se permiten imágenes');
        return;
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.notificationService.showError('La imagen no debe superar 5MB');
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
    this.isSavingAttempted = true;
    // 1. Validar campos obligatorios
    if (!this.userFirstName || !this.userFirstName.trim()) {
      this.notificationService.showError('El nombre es obligatorio');
      return;
    }
    if (!this.userLastName || !this.userLastName.trim()) {
      this.notificationService.showError('El apellido es obligatorio');
      return;
    }

    // 2. Detectar si hay cambios
    const hasPhotoChange = !!this.previewFile;
    const hasDataChange =
      this.userFirstName !== this.initialState?.nombre ||
      this.userLastName !== this.initialState?.apellido ||
      this.birthDate !== this.initialState?.fechaNacimiento;

    if (!hasPhotoChange && !hasDataChange) {
      this.notificationService.showInfo('No se han realizado cambios en el perfil');
      return;
    }

    this.isSaving = true;

    // Si hay nuevo archivo, subirlo primero
    if (this.previewFile) {
      this.isUploading = true;

      this.fileUploadService.uploadProfilePhoto(this.previewFile, this.userId).subscribe({
        next: (response) => {
          this.isUploading = false;

          if (response.success && response.filePath) {
            // Construir URL completa del archivo
            const fullPhotoUrl = response.filePath.startsWith('http')
              ? response.filePath
              : `${this.apiBaseUrl}${response.filePath}`;

            this.profilePhoto = fullPhotoUrl;

            // Guardar en sessionStorage temporalmente hasta que se actualice el token
            sessionStorage.setItem('user_profile_photo', fullPhotoUrl);

            // Aquí iría la llamada a API para actualizar el perfil con la nueva foto
            this._completeProfileSave();
          } else {
            this.notificationService.showError('Error al subir la foto');
            this.isSaving = false;
          }
        },
        error: (error) => {
          this.isUploading = false;
          this.isSaving = false;
          console.error('Error uploading file:', error);
          this.notificationService.showError('Error al subir la foto. Intenta de nuevo.');
        }
      });
    } else {
      // Si no hay nuevo archivo, solo guardar otros datos
      this._completeProfileSave();
    }
  }

  /**
   * Completar guardado de perfil
   * Actualiza el perfil en el backend y recarga la página
   */
  private _completeProfileSave(): void {
    const profileData = {
      nombre: this.userFirstName,
      apellido: this.userLastName,
      fechaNacimiento: this.birthDate || null,
      fotoPerfilUrl: this.profilePhoto || null,
    };

    // Llamar al endpoint PUT /api/usuarios/me para actualizar el perfil
    this.authService.updateMyProfile(profileData).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.previewPhoto = null;
        this.previewFile = null;
        this.notificationService.showSuccess('Perfil actualizado correctamente');
        console.log('Perfil actualizado exitosamente');

        // Actualizar estado inicial después de guardar con éxito
        this.initialState = {
          nombre: this.userFirstName,
          apellido: this.userLastName,
          fechaNacimiento: this.birthDate,
          photoUrl: this.profilePhoto
        };
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error al actualizar perfil:', error);
        this.notificationService.showError('Error al guardar los cambios. Intenta de nuevo.');
      }
    });
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
