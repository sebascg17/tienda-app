import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css'
})
export class AvatarComponent implements OnInit {
  @Input() name: string = 'Usuario';
  @Input() photoUrl: string | null = null;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() backgroundColor: string = '#08d15f';

  initial: string = 'U';
  sizeClasses: string = '';
  textSizeClass: string = '';
  isDarkMode: boolean = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.initial = (this.name.charAt(0) || 'U').toUpperCase();
    
    // Suscribirse a cambios de tema
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      this.setSizeClasses();
    });
    
    this.setSizeClasses();
  }

  private setSizeClasses() {
    // Usar color dinámico: verde claro en modo oscuro, más oscuro en modo claro
    const bgColor = this.isDarkMode ? '#10b981' : '#08d15f';
    const style = `background-color: ${bgColor};`;
    
    switch (this.size) {
      case 'small':
        this.sizeClasses = `h-8 w-8 rounded-full flex items-center justify-center ${style}`;
        this.textSizeClass = 'text-xs';
        break;
      case 'large':
        this.sizeClasses = `h-16 w-16 rounded-full flex items-center justify-center ${style}`;
        this.textSizeClass = 'text-2xl';
        break;
      case 'medium':
      default:
        this.sizeClasses = `h-10 w-10 rounded-full flex items-center justify-center ${style}`;
        this.textSizeClass = 'text-sm';
    }
  }
}
