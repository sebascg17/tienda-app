import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LocationService } from '../../../core/services/location.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css',
})
export class AccountSettingsComponent implements OnInit {
  // Información de contacto
  phoneNumber: string = '';
  countryCode: string = '+1';

  // Ubicación
  selectedCountry: string = '';
  selectedState: string = '';
  selectedCity: string = '';

  // Datos disponibles
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];

  // Estados
  isLoading: boolean = false;
  isSaving: boolean = false;
  isSavingAttempted: boolean = false;
  activeTab: 'contact' | 'location' = 'contact';

  private initialContactState: any = null;
  private initialLocationState: any = null;

  constructor(
    private i18nService: I18nService,
    private authService: AuthService,
    private locationService: LocationService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadAccountSettings();
    this.loadCountries();
  }

  /**
   * Cargar configuración de cuenta
   */
  loadAccountSettings(): void {
    this.isLoading = true;
    // Aquí iría la llamada a la API
    // Simulación:
    setTimeout(() => {
      this.isLoading = false;
      // Inicializar estados para detección de cambios (Simulado con valores actuales)
      this.initialContactState = {
        phoneNumber: this.phoneNumber,
        countryCode: this.countryCode
      };
      this.initialLocationState = {
        country: this.selectedCountry,
        state: this.selectedState,
        city: this.selectedCity
      };
    }, 500);
  }

  /**
   * Cargar lista de países
   */
  loadCountries(): void {
    this.locationService.getPaises().subscribe(
      (data) => {
        this.countries = data;
      },
      (error) => {
        console.error('Error cargando países:', error);
      }
    );
  }

  /**
   * Cargar estados cuando cambia el país
   */
  onCountryChange(): void {
    if (this.selectedCountry) {
      this.locationService.getDepartamentos(parseInt(this.selectedCountry)).subscribe(
        (data) => {
          this.states = data;
          this.selectedState = '';
          this.selectedCity = '';
          this.cities = [];
        },
        (error) => {
          console.error('Error cargando estados:', error);
        }
      );
    }
  }

  /**
   * Cargar ciudades cuando cambia el estado
   */
  onStateChange(): void {
    if (this.selectedCountry && this.selectedState) {
      this.locationService.getMunicipios(parseInt(this.selectedState)).subscribe(
        (data) => {
          this.cities = data;
          this.selectedCity = '';
        },
        (error) => {
          console.error('Error cargando ciudades:', error);
        }
      );
    }
  }

  /**
   * Guardar cambios de contacto
   */
  saveContactInfo(): void {
    this.isSavingAttempted = true;
    // 1. Validar teléfono (ejemplo simple: longitud mínima)
    if (this.phoneNumber && this.phoneNumber.length < 7) {
      this.notificationService.showError('El número de teléfono no es válido', 'Error de Validación');
      return;
    }

    // 2. Detectar cambios
    const hasChanges =
      this.phoneNumber !== this.initialContactState?.phoneNumber ||
      this.countryCode !== this.initialContactState?.countryCode;

    if (!hasChanges) {
      this.notificationService.showInfo('No se detectaron cambios en la información de contacto');
      return;
    }

    this.isSaving = true;

    const contactData = {
      telefonoNumber: this.phoneNumber,
      countryCode: this.countryCode,
    };

    // Aquí iría la llamada a la API
    // this.apiService.updateContactInfo(contactData).subscribe(
    //   (response) => {
    //     this.isSaving = false;
    //     this.successMessage = this.i18nService.translate('messages.success');
    //     setTimeout(() => (this.successMessage = ''), 3000);
    //   },
    //   (error) => {
    //     this.isSaving = false;
    //     this.errorMessage = this.i18nService.translate('messages.error');
    //   }
    // );

    // Simulación:
    setTimeout(() => {
      this.isSaving = false;
      this.notificationService.showSuccess(this.i18nService.translate('messages.success'));

      // Actualizar estado inicial
      this.initialContactState = {
        phoneNumber: this.phoneNumber,
        countryCode: this.countryCode
      };
    }, 1000);
  }

  /**
   * Guardar cambios de ubicación
   */
  saveLocationInfo(): void {
    this.isSavingAttempted = true;
    // 1. Validar campos obligatorios
    if (!this.selectedCountry || !this.selectedState || !this.selectedCity) {
      this.notificationService.showError('Por favor completa todos los campos de ubicación');
      return;
    }

    // 2. Detectar cambios
    const hasChanges =
      this.selectedCountry !== this.initialLocationState?.country ||
      this.selectedState !== this.initialLocationState?.state ||
      this.selectedCity !== this.initialLocationState?.city;

    if (!hasChanges) {
      this.notificationService.showInfo('No se detectaron cambios en la ubicación');
      return;
    }

    this.isSaving = true;

    const locationData = {
      pais: this.selectedCountry,
      departamento: this.selectedState,
      ciudad: this.selectedCity,
    };

    // Aquí iría la llamada a la API
    // this.apiService.updateLocationInfo(locationData).subscribe(
    //   (response) => {
    //     this.isSaving = false;
    //     this.successMessage = this.i18nService.translate('messages.success');
    //     setTimeout(() => (this.successMessage = ''), 3000);
    //   },
    //   (error) => {
    //     this.isSaving = false;
    //     this.errorMessage = this.i18nService.translate('messages.error');
    //   }
    // );

    // Simulación:
    setTimeout(() => {
      this.isSaving = false;
      this.notificationService.showSuccess(this.i18nService.translate('messages.success'));

      // Actualizar estado inicial
      this.initialLocationState = {
        country: this.selectedCountry,
        state: this.selectedState,
        city: this.selectedCity
      };
    }, 1000);
  }

  /**
   * Cambiar activamente la pestaña
   */
  switchTab(tab: 'contact' | 'location'): void {
    this.activeTab = tab;
  }
}
