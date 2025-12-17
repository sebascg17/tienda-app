import { Component } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loadingService.isLoading$ | async" class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300">
      <div class="flex flex-col items-center">
        <!-- Logo Pulsing -->
        <div class="relative w-32 h-32 animate-pulse">
           <img src="assets/logo/SBENIX_LOGO_VERDE.png" alt="Cargando..." class="w-full h-full object-contain drop-shadow-lg">
           <!-- Spinner Ring Overlay -->
           <div class="absolute inset-0 border-4 border-[#08d15f] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="mt-4 text-[#08d15f] font-bold text-lg animate-bounce">Cargando...</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) { }
}
