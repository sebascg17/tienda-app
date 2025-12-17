import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './main-layout.component.html',
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

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.checkLoginStatus();

    // Suscribirse a cambios de tema
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      this._updateLogoPath();
    });
  }

  changeLanguage(lang: string) {
    this.currentLang = lang;
    console.log('Idioma cambiado a:', lang);
    // Aquí iría la lógica real de traducción (ngx-translate, etc.)
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
        this.userName = payload.unique_name || payload.email || 'Usuario';
        this.userEmail = payload.email || payload.sub;
        this.userInitial = (this.userName[0] || 'U').toUpperCase();

        // Determinar link de dashboard
        const roles = payload.role || [];
        const userRoles = Array.isArray(roles) ? roles : [roles];

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
      }
    } else {
      this.isAuthenticated = false;
      this.userName = '';
    }
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.isAuthenticated = false;
    this.isDrawerOpen = false;
    this.router.navigate(['/login']);
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
