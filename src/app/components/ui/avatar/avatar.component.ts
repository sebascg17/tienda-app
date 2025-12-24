import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css'
})
export class AvatarComponent implements OnInit, OnChanges {
  @Input() name: string = 'Usuario';
  @Input() lastName: string = ''; // Nuevo input para apellido
  @Input() photoUrl: string | null = null;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() backgroundColor: string = '#08d15f';

  initial: string = 'U';
  sizeClasses: string = '';
  textSizeClass: string = '';
  isDarkMode: boolean = false;
  photoLoaded: boolean = false; // Rastrear si la imagen cargó correctamente
  computedBackgroundColor: string = '#08d15f'; // Color dinámico según tema

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    // Suscribirse a cambios de tema
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      this.updateAvatar();
    });

    this.updateAvatar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['name'] || changes['lastName'] || changes['size'] || changes['backgroundColor'] || changes['photoUrl']) {
      if (changes['photoUrl']) {
        this.photoLoaded = false;
      }
      this.updateAvatar();
    }
  }

  private updateAvatar() {
    this.setInitials();
    this.setSizeClasses();
  }

  private setInitials() {
    const firstInitial = (this.name?.charAt(0) || 'U').toUpperCase();
    const lastInitial = (this.lastName?.charAt(0) || '').toUpperCase();
    this.initial = firstInitial + lastInitial;
  }

  // Manejador para cuando la imagen carga correctamente
  onPhotoLoaded() {
    this.photoLoaded = true;
  }

  // Manejador para cuando la imagen falla (404, error de red, etc.)
  onPhotoError() {
    this.photoLoaded = false;
  }

  private setSizeClasses() {
    // Usar color dinámico: verde claro en modo oscuro, más oscuro en modo claro
    this.computedBackgroundColor = this.isDarkMode ? '#10b981' : this.backgroundColor || '#08d15f';

    switch (this.size) {
      case 'small':
        this.sizeClasses = `h-8 w-8 rounded-full flex items-center justify-center`;
        this.textSizeClass = 'text-xs font-semibold text-white';
        break;
      case 'large':
        this.sizeClasses = `h-16 w-16 rounded-full flex items-center justify-center`;
        this.textSizeClass = 'text-2xl font-semibold text-white';
        break;
      case 'medium':
      default:
        this.sizeClasses = `h-10 w-10 rounded-full flex items-center justify-center`;
        this.textSizeClass = 'text-sm font-semibold text-white';
    }
  }
}
