import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AvatarComponent } from '../ui/avatar/avatar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, TranslatePipe, AvatarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  currentYear: number = new Date().getFullYear();

  // 1. Propiedades de Control de Layout
  isAuthenticated: boolean = false;
  isDrawerOpen: boolean = false; // Right profile drawer
  isSidebarOpen: boolean = false; // Left navigation sidebar

  // Theme & Branding
  isDarkMode: boolean = false;
  // LOGO: Asegúrate de que este archivo exista en src/assets/logo/
  logoPath: string = 'assets/logo/SBENIX_LOGO_VERDE.png';
  private themeSubscription!: Subscription;

  // I18N (Simulado)
  currentLang: string = 'ES';

  // Datos de usuario simulados/decodificados
  userName: string = 'Usuario';
  userEmail: string = 'usuario@sbenix.com';
  userInitial: string = 'U';
  userPhotoUrl: string | null = null;
  userRole: string = 'Cliente'; // Default role

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
    this.checkLoginStatus();

    // Cargar idioma guardado
    this.currentLang = this.i18nService.getCurrentLanguage();

    // Suscribirse a cambios de idioma
    this.i18nService.currentLanguage$.subscribe((lang) => {
      this.currentLang = lang;
    });

    // Suscribirse a cambios de tema
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      this._updateLogoPath();
    });

    // Escuchar evento personalizado cuando se actualiza el perfil
    window.addEventListener('profileUpdated', (event: any) => {
      if (this.isAuthenticated && event.detail?.profilePhotoUrl) {
        this.userPhotoUrl = event.detail.profilePhotoUrl;
      }
    });

    // Escuchar cambios en sessionStorage (foto temporal durante la sesión)
    window.addEventListener('storage', () => {
      if (this.isAuthenticated) {
        const sessionPhoto = sessionStorage.getItem('user_profile_photo');
        if (sessionPhoto) {
          this.userPhotoUrl = sessionPhoto;
        }
      }
    });
  }

  changeLanguage(lang: string) {
    if (this.i18nService.isLanguageSupported(lang)) {
      this.i18nService.setLanguage(lang);
    }
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  // 2. Lógica de Autenticación
  dashboardLink: string = '/cliente'; // Default

  checkLoginStatus() {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      this.isAuthenticated = true;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // DEBUG: Log para ver qué hay en el payload
        console.log('JWT Payload:', payload);
        
        // Obtener nombre - intentar múltiples campos posibles del JWT
        this.userName = 
          payload.name ||                    // Campo standard OIDC
          payload.given_name ||              // Nombre de pila OIDC
          payload.unique_name ||             // Azure AD
          payload.email?.split('@')[0] ||    // Parte antes del @ del email
          payload.email ||                   // Email completo
          payload.sub ||                     // Subject
          'Usuario';                         // Fallback
        
        // Obtener email
        this.userEmail = payload.email || payload.sub || '';
        
        // Obtener inicial del nombre
        this.userInitial = (this.userName && this.userName[0] ? this.userName[0] : 'U').toUpperCase();

        // Obtener rol - intentar múltiples campos
        let roleValue = payload.role || payload.roles || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        
        // Manejar rol como string o array
        let userRoles: string[] = [];
        if (Array.isArray(roleValue)) {
          userRoles = roleValue;
        } else if (typeof roleValue === 'string') {
          userRoles = [roleValue];
        }
        
        // Asignar primer rol encontrado, o 'Cliente' por defecto
        this.userRole = userRoles[0] || 'Cliente';
        
        console.log('Rol extraído:', this.userRole, 'Roles del payload:', userRoles);

        // Intentar obtener la foto del perfil (escalable)
        const sessionPhoto = sessionStorage.getItem('user_profile_photo');
        if (sessionPhoto) {
          this.userPhotoUrl = sessionPhoto;
        } else if (payload.profilePhotoUrl) {
          this.userPhotoUrl = payload.profilePhotoUrl;
        } else {
          this.userPhotoUrl = null;
        }

        // Determinar link de dashboard basado en roles
        if (userRoles.includes('Admin')) {
          this.dashboardLink = '/admin';
        } else if (userRoles.includes('Tendero')) {
          this.dashboardLink = '/store';
        } else {
          this.dashboardLink = '/client';
        }
      } catch (e) {
        console.error('Error decodificando token', e);
        this.userName = 'Usuario';
        this.userRole = 'Cliente';
      }
    } else {
      this.isAuthenticated = false;
      this.userName = '';
      this.userRole = 'Cliente';
    }
  }

  logout() {
    // Limpiar datos de sesión
    localStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_profile_photo');
    
    // Resetear estado del layout
    this.isAuthenticated = false;
    this.isDrawerOpen = false;
    this.userName = '';
    this.userEmail = '';
    this.userPhotoUrl = null;
    this.userRole = 'Cliente';
    
    // Navegar al home y recargar la página
    this.router.navigate(['/']).then(() => {
      // Recargar para limpiar todos los listeners y estado
      window.location.reload();
    });
  }

  getHomeRoute(): string {
    // Si está autenticado, redirige al dashboard según el rol
    if (this.isAuthenticated) {
      return this.dashboardLink;
    }
    // Si no está autenticado, redirige a la página principal
    return '/';
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // 3. Lógica de Temas y Branding
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  private _updateLogoPath() {
    // Ruta estática solicitada: assets/logo/
    const basePath = 'assets/logo/';

    // Usar SIEMPRE el logo verde, independientemente del tema (solicitud de usuario)
    this.logoPath = `${basePath}SBENIX_TEXTO_VERDE.png`;

    // if (this.isDarkMode) {
    //   // Modo Oscuro: Logo Blanco
    //   this.logoPath = `${basePath}SBENIX_TEXTO_BLANCO.png`;
    // } else {
    //   // Modo Claro: Logo Verde
    //   this.logoPath = `${basePath}SBENIX_TEXTO_VERDE.png`;
    // }
  }
}
