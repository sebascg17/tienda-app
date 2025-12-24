import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LocationService } from '../../../core/services/location.service';
import { User } from '../../../models/user.model';
import { AvatarComponent } from '../../ui/avatar/avatar.component';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, AvatarComponent],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  // Tabs
  activeTab: 'general' | 'location' | 'security' = 'general';

  // State
  isLoading: boolean = true;
  isSaving: boolean = false;
  isSavingAttempted: boolean = false;
  isUploading: boolean = false;

  // Form Data - General
  userFirstName: string = '';
  userLastName: string = '';
  userEmail: string = '';
  birthDate: string = '';
  profilePhoto: string | null = null;
  previewPhoto: string | null = null;
  previewFile: File | null = null;

  // Form Data - Location & Contact
  phoneNumber: string = '';
  countryCode: string = '+57';
  selectedCountry: string = '';
  selectedState: string = '';
  selectedCity: string = '';
  neighborhood: string = '';
  address: string = '';

  // Geographic Data
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];

  // Form Data - Security
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  private userSubscription!: Subscription;
  private initialState: any = null;

  constructor(
    private i18nService: I18nService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.loadGeographicData();
    this.subscribeToUser();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private subscribeToUser(): void {
    this.userSubscription = this.authService.currentUser$.subscribe({
      next: (user) => {
        if (user && user.isAuthenticated) {
          this.populateFormData(user);
          this.isLoading = false;
        }
      }
    });
  }

  private populateFormData(user: User): void {
    this.userFirstName = user.nombre || '';
    this.userLastName = user.apellido || '';
    this.userEmail = user.email || '';
    this.profilePhoto = user.photoUrl || null;
    this.phoneNumber = user.telefono || '';
    this.address = user.direccion || '';
    this.selectedCountry = user.pais || '';
    this.selectedState = user.departamento || '';
    this.selectedCity = user.ciudad || '';
    this.neighborhood = user.barrio || '';

    if (user.fechaNacimiento) {
      this.birthDate = new Date(user.fechaNacimiento).toISOString().split('T')[0];
    }

    // Guardar estado inicial para detección de cambios
    if (!this.initialState) {
      this.saveInitialState();
    }

    // Trigger geographic цепочка if values exist
    if (this.selectedCountry) this.onCountryChange(false);
    if (this.selectedState) this.onStateChange(false);
  }

  private saveInitialState(): void {
    this.initialState = {
      nombre: this.userFirstName,
      apellido: this.userLastName,
      email: this.userEmail,
      fechaNacimiento: this.birthDate,
      photoUrl: this.profilePhoto,
      telefono: this.phoneNumber,
      direccion: this.address,
      pais: this.selectedCountry,
      departamento: this.selectedState,
      ciudad: this.selectedCity,
      barrio: this.neighborhood
    };
  }

  // Geographic Helpers
  private loadGeographicData(): void {
    this.locationService.getPaises().subscribe({
      next: (data) => this.countries = data,
      error: (err) => console.error('Error loading countries', err)
    });
  }

  onCountryChange(resetSub: boolean = true): void {
    if (this.selectedCountry) {
      this.locationService.getDepartamentos(Number(this.selectedCountry)).subscribe({
        next: (data) => {
          this.states = data;
          if (resetSub) {
            this.selectedState = '';
            this.selectedCity = '';
            this.cities = [];
          }
        }
      });
    }
  }

  onStateChange(resetSub: boolean = true): void {
    if (this.selectedState) {
      this.locationService.getMunicipios(Number(this.selectedState)).subscribe({
        next: (data) => {
          this.cities = data;
          if (resetSub) {
            this.selectedCity = '';
          }
        }
      });
    }
  }

  // Photo Methods
  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.notificationService.showError('El archivo debe ser una imagen');
        return;
      }
      this.previewFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewPhoto = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  cancelPhotoChange(): void {
    this.previewFile = null;
    this.previewPhoto = null;
  }

  // Tab Switch
  switchTab(tab: 'general' | 'location' | 'security'): void {
    this.activeTab = tab;
    this.isSavingAttempted = false;
  }

  // Save Actions
  saveChanges(): void {
    this.isSavingAttempted = true;

    if (this.activeTab === 'general') {
      this.saveGeneral();
    } else if (this.activeTab === 'location') {
      this.saveLocation();
    } else if (this.activeTab === 'security') {
      this.saveSecurity();
    }
  }

  private hasChanges(): boolean {
    return (
      this.userFirstName !== this.initialState.nombre ||
      this.userLastName !== this.initialState.apellido ||
      this.birthDate !== this.initialState.fechaNacimiento ||
      !!this.previewFile ||
      this.phoneNumber !== this.initialState.telefono ||
      this.address !== this.initialState.direccion ||
      this.selectedCountry !== this.initialState.pais ||
      this.selectedState !== this.initialState.departamento ||
      this.selectedCity !== this.initialState.ciudad ||
      this.neighborhood !== this.initialState.barrio
    );
  }

  private saveGeneral(): void {
    if (!this.userFirstName?.trim() || !this.userLastName?.trim()) {
      this.notificationService.showError('El nombre y apellido son obligatorios');
      return;
    }

    if (!this.hasChanges()) {
      this.notificationService.showInfo('No se detectaron cambios');
      return;
    }

    this.isSaving = true;

    // Si hay foto, subirla
    if (this.previewFile) {
      this.isUploading = true;
      this.authService.uploadPhoto(this.previewFile).subscribe({
        next: (response: any) => {
          this.profilePhoto = response.url;
          this.isUploading = false;
          this.previewFile = null;
          this.previewPhoto = null;
          this.updateProfile();
        },
        error: () => {
          this.isUploading = false;
          this.notificationService.showError('Error al subir la foto');
        }
      });
    } else {
      this.updateProfile();
    }
  }

  private saveLocation(): void {
    if (!this.selectedCountry || !this.selectedState || !this.selectedCity) {
      this.notificationService.showError('País, departamento y ciudad son obligatorios');
      return;
    }

    if (!this.hasChanges()) {
      this.notificationService.showInfo('No se detectaron cambios');
      return;
    }

    this.isSaving = true;
    this.updateProfile();
  }

  private updateProfile(): void {
    const updateDto = {
      nombre: this.userFirstName,
      apellido: this.userLastName,
      fechaNacimiento: this.birthDate ? new Date(this.birthDate) : undefined,
      fotoPerfilUrl: this.profilePhoto || undefined,
      telefono: this.phoneNumber,
      direccion: this.address,
      pais: this.selectedCountry,
      departamento: this.selectedState,
      ciudad: this.selectedCity,
      barrio: this.neighborhood
    };

    this.authService.updateMyProfile(updateDto).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveInitialState();
        this.notificationService.showSuccess('Configuración actualizada correctamente');
      },
      error: () => {
        this.isSaving = false;
        this.notificationService.showError('Error al guardar los cambios');
      }
    });
  }

  private saveSecurity(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.notificationService.showError('Por favor completa todos los campos de contraseña');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.notificationService.showError('Las nuevas contraseñas no coinciden');
      return;
    }

    this.isSaving = true;
    this.authService.updateMyProfile({ password: this.newPassword }).subscribe({
      next: () => {
        this.isSaving = false;
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.isSavingAttempted = false;
        this.notificationService.showSuccess('Contraseña actualizada correctamente');
      },
      error: () => {
        this.isSaving = false;
        this.notificationService.showError('Error al actualizar la contraseña');
      }
    });
  }
}
