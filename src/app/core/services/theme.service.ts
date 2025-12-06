import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    // Verificar preferencia del sistema o guardada
    if (localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.setDarkMode(true);
    } else {
      this.setDarkMode(false);
    }
  }

  toggleTheme() {
    this.setDarkMode(!this.isDarkModeSubject.value);
  }

  private setDarkMode(isDark: boolean) {
    this.isDarkModeSubject.next(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  getCurrentState(): boolean {
    return this.isDarkModeSubject.value;
  }
}
