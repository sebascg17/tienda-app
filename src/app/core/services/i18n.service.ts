import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Translations {
  [key: string]: {
    [key: string]: string | Translations;
  };
}

// Definir las traducciones
const translations: { [key: string]: Translations } = {
  ES: {
    common: {
      logout: 'Cerrar Sesión',
      settings: 'Configuración',
      profile: 'Perfil',
      firstName: 'Nombre',
      lastName: 'Apellido',
      language: 'Idioma',
      theme: 'Tema',
      darkMode: 'Modo Oscuro',
      lightMode: 'Modo Claro',
      welcome: 'Bienvenido',
      home: 'Inicio',
      products: 'Productos',
      orders: 'Pedidos',
      dashboard: 'Dashboard',
      account: 'Cuenta',
      menu: 'Menú',
    },
    nav: {
      home: 'Inicio',
      products: 'Productos',
      orders: 'Pedidos',
      dashboard: 'Dashboard',
      categories: 'Categorías',
      contact: 'Contacto',
    },
    auth: {
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      logout: 'Cerrar Sesión',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes cuenta?',
      haveAccount: '¿Ya tienes cuenta?',
      googleLogin: 'Iniciar sesión con Google',
      facebookLogin: 'Iniciar sesión con Facebook',
    },
    dashboard: {
      welcome: 'Bienvenido',
      admin: 'Panel de Administración',
      vendor: 'Panel del Vendedor',
      client: 'Panel del Cliente',
    },
    profile: {
      editProfile: 'Editar Perfil',
      changePhoto: 'Cambiar Foto de Perfil',
      accountSettings: 'Configuración de Cuenta',
      personalInfo: 'Información Personal',
      location: 'Ubicación',
      contact: 'Contacto',
      country: 'País',
      state: 'Departamento',
      city: 'Ciudad',
      phone: 'Teléfono',
      countryCode: 'Código de País',
      birthDate: 'Fecha de Nacimiento',
      save: 'Guardar',
      cancel: 'Cancelar',
    },
    home: {
      title: 'Descubre los Mejores Productos',
      subtitle: 'Acceso a miles de productos de calidad en un solo lugar',
      description: 'Plataforma SBENIX: tu espacio digital para comprar y vender con confianza',
      callToAction: '¿Listo para comenzar?',
      buyButton: 'Soy Comprador',
      sellButton: 'Soy Vendedor',
      benefits: 'Por qué elegirnos',
      betterWay: 'Una mejor forma de hacer negocios',
      forSellers: 'Para Vendedores',
      sellersBenefit: 'Alcanza miles de clientes, gestiona tu tienda fácilmente y aumenta tus ventas',
      forClients: 'Para Clientes',
      clientsBenefit: 'Encuentra productos de calidad, compara precios y disfruta de envíos rápidos y seguros',
      featuredProducts: 'Productos Destacados',
      featuredProductsDescription: 'Explora nuestra selección de los mejores productos del mercado',
      viewDetails: 'Ver Detalles',
      benefit1: 'Envíos Rápidos',
      benefit1Desc: 'Recibe tus compras en tiempo récord',
      benefit2: 'Garantía de Calidad',
      benefit2Desc: 'Todos nuestros productos están certificados',
      benefit3: 'Soporte 24/7',
      benefit3Desc: 'Estamos aquí para ayudarte en cualquier momento',
    },
    messages: {
      success: 'Operación completada exitosamente',
      error: 'Ocurrió un error',
      loading: 'Cargando...',
      confirmDelete: '¿Estás seguro de que deseas eliminar esto?',
      noProducts: 'No hay productos disponibles',
    },
  },
  EN: {
    common: {
      logout: 'Logout',
      settings: 'Settings',
      profile: 'Profile',
      firstName: 'First Name',
      lastName: 'Last Name',
      language: 'Language',
      theme: 'Theme',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      welcome: 'Welcome',
      home: 'Home',
      products: 'Products',
      orders: 'Orders',
      dashboard: 'Dashboard',
      account: 'Account',
      menu: 'Menu',
    },
    nav: {
      home: 'Home',
      products: 'Products',
      orders: 'Orders',
      dashboard: 'Dashboard',
      categories: 'Categories',
      contact: 'Contact',
    },
    auth: {
      login: 'Login',
      register: 'Sign Up',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot your password?',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      googleLogin: 'Sign in with Google',
      facebookLogin: 'Sign in with Facebook',
    },
    dashboard: {
      welcome: 'Welcome',
      admin: 'Admin Panel',
      vendor: 'Vendor Panel',
      client: 'Client Panel',
    },
    profile: {
      editProfile: 'Edit Profile',
      changePhoto: 'Change Profile Picture',
      accountSettings: 'Account Settings',
      personalInfo: 'Personal Information',
      location: 'Location',
      contact: 'Contact',
      country: 'Country',
      state: 'State',
      city: 'City',
      phone: 'Phone',
      countryCode: 'Country Code',
      birthDate: 'Birth Date',
      save: 'Save',
      cancel: 'Cancel',
    },
    home: {
      title: 'Discover the Best Products',
      subtitle: 'Access thousands of quality products in one place',
      description: 'SBENIX Platform: your digital space to buy and sell with confidence',
      callToAction: 'Ready to get started?',
      buyButton: 'I\'m a Buyer',
      sellButton: 'I\'m a Seller',
      benefits: 'Why choose us',
      betterWay: 'A better way to do business',
      forSellers: 'For Sellers',
      sellersBenefit: 'Reach thousands of customers, manage your store easily and increase your sales',
      forClients: 'For Customers',
      clientsBenefit: 'Find quality products, compare prices and enjoy fast and secure shipping',
      featuredProducts: 'Featured Products',
      featuredProductsDescription: 'Explore our selection of the best products on the market',
      viewDetails: 'View Details',
      benefit1: 'Fast Shipping',
      benefit1Desc: 'Receive your purchases in record time',
      benefit2: 'Quality Guarantee',
      benefit2Desc: 'All our products are certified',
      benefit3: '24/7 Support',
      benefit3Desc: 'We are here to help you at any time',
    },
    messages: {
      success: 'Operation completed successfully',
      error: 'An error occurred',
      loading: 'Loading...',
      confirmDelete: 'Are you sure you want to delete this?',
      noProducts: 'No products available',
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private currentLanguage = new BehaviorSubject<string>(
    localStorage.getItem('language') || 'ES'
  );
  public currentLanguage$ = this.currentLanguage.asObservable();

  constructor() {
    // Cargar idioma guardado o usar ES por defecto
    const savedLanguage = localStorage.getItem('language') || 'ES';
    this.currentLanguage.next(savedLanguage);
  }

  /**
   * Obtiene el idioma actual
   */
  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }

  /**
   * Cambia el idioma actual
   */
  setLanguage(lang: string): void {
    if (translations[lang]) {
      this.currentLanguage.next(lang);
      localStorage.setItem('language', lang);
    } else {
      console.warn(`Idioma '${lang}' no soportado`);
    }
  }

  /**
   * Obtiene una traducción por clave (dot notation)
   * Ejemplo: translate('common.logout') => 'Cerrar Sesión'
   */
  translate(key: string): string {
    const lang = this.currentLanguage.value;
    const keys = key.split('.');
    let current: any = translations[lang];

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Si no encuentra la traducción, retorna la clave
        return key;
      }
    }

    return typeof current === 'string' ? current : key;
  }

  /**
   * Obtiene todas las traducciones del idioma actual
   */
  getTranslations(): Translations {
    return translations[this.currentLanguage.value] || translations['ES'];
  }

  /**
   * Comprueba si un idioma está soportado
   */
  isLanguageSupported(lang: string): boolean {
    return lang in translations;
  }

  /**
   * Obtiene lista de idiomas soportados
   */
  getSupportedLanguages(): string[] {
    return Object.keys(translations);
  }
}
