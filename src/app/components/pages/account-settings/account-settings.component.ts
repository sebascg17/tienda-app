import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LocationService } from '../../../core/services/location.service';

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
  successMessage: string = '';
  errorMessage: string = '';
  activeTab: 'contact' | 'location' = 'contact';

  constructor(
    private i18nService: I18nService,
    private authService: AuthService,
    private locationService: LocationService
  ) {}

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
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

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
      this.successMessage = this.i18nService.translate('messages.success');
      setTimeout(() => (this.successMessage = ''), 3000);
    }, 1000);
  }

  /**
   * Guardar cambios de ubicación
   */
  saveLocationInfo(): void {
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

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
      this.successMessage = this.i18nService.translate('messages.success');
      setTimeout(() => (this.successMessage = ''), 3000);
    }, 1000);
  }

  /**
   * Cambiar activamente la pestaña
   */
  switchTab(tab: 'contact' | 'location'): void {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
  }
}
