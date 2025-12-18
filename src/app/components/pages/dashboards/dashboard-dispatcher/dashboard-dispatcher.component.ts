import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-dashboard-dispatcher',
  standalone: true,
  template: `
    <div class="dispatcher-container">
      <div class="spinner"></div>
      <p>Redirigiendo a tu panel personalizado...</p>
    </div>
  `,
  styles: [`
    .dispatcher-container {
      display: flex; 
      justify-content: center; 
      align-items: center; 
      height: 80vh; 
      flex-direction: column;
    }
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: #007bff;
      animation: spin 1s ease infinite;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class DashboardDispatcherComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // 1. Obtenemos el array de roles desde el servicio
    const roles = this.authService.getUserRoles(); 

    // 2. Lógica de redirección basada en prioridades
    if (roles.includes('Admin')) {
      this.router.navigate(['/admin']);
    } else if (roles.includes('Tendero')) {
      this.router.navigate(['/store']);
    } else if (roles.includes('Cliente')) {
      this.router.navigate(['/client']);
    } else {
      // Si no hay roles reconocidos o está vacío
      this.router.navigate(['/']); 
    }
  }
}