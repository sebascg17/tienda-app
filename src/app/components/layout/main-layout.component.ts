import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AvatarComponent } from '../ui/avatar/avatar.component';
import { Subscription } from 'rxjs';
import { NotificationComponent } from '../ui/notification/notification.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, TranslatePipe, AvatarComponent, NotificationComponent],
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

  // Perfil del usuario reactivo
  private userSubscription!: Subscription;
  userPhotoUrl: string | null = null;
  userRole: string = 'Cliente';
  userName: string = 'Usuario';
  userLastName: string = '';
  userEmail: string = '';
  userInitial: string = 'U';
  dashboardLink: string = '/client';

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private i18nService: I18nService,
    private authService: AuthService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
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

    // Suscribirse al estado del usuario (Centralizado en AuthService)
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isAuthenticated = user.isAuthenticated;
        this.userName = user.nombre || 'Usuario';
        this.userLastName = user.apellido || '';
        this.userEmail = user.email || '';

        // Determinar rol (el primero en la lista o Cliente)
        this.userRole = user.roles && user.roles.length > 0 ? user.roles[0] : 'Cliente';

        // Link de dashboard según rol
        if (user.roles?.includes('Admin')) {
          this.dashboardLink = '/admin';
        } else if (user.roles?.includes('Tendero')) {
          this.dashboardLink = '/store';
        } else {
          this.dashboardLink = '/client';
        }

        // Manejar URL de la foto
        if (user.photoUrl) {
          this.userPhotoUrl = user.photoUrl.startsWith('http')
            ? user.photoUrl
            : `http://localhost:5237${user.photoUrl}`;
        } else {
          this.userPhotoUrl = null;
        }

        this.userInitial = (this.userName[0] || 'U').toUpperCase();
        console.log('UI sincronizada reactivamente:', user);
      } else {
        this.isAuthenticated = false;
        this.userName = 'Usuario';
        this.userLastName = '';
        this.userPhotoUrl = null;
        this.userRole = 'Cliente';
      }
    });

    // Cargar datos frescos del servidor al iniciar
    if (localStorage.getItem('jwt_token')) {
      this.authService.getMe().subscribe();
    }
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
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Eliminados métodos internos redundantes, ahora controlados por AuthService
  checkLoginStatus() { }
  private loadUserProfile(): void { }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  /**
   * Cerrar drawer al hacer click fuera
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.isDrawerOpen) {
      const clickedInside = this.el.nativeElement.querySelector('.relative')?.contains(event.target);
      if (!clickedInside) {
        this.isDrawerOpen = false;
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getHomeRoute(): string {
    // Si está autenticado, redirige al dashboard según el rol
    if (this.isAuthenticated) {
      return this.dashboardLink;
    }
    // Si no está autenticado, redirige a la página principal
    return '/';
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
