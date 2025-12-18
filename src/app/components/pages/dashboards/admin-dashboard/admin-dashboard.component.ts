import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  
  // Datos del usuario
  userName: string = 'Administrador';
  userEmail: string = '';

  // Estadísticas
  stats = {
    totalUsers: 1245,
    totalProducts: 3842,
    totalOrders: 892,
    totalRevenue: 125640.50
  };

  // Usuarios recientes
  recentUsers = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Cliente', joinDate: '2024-01-15' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'Tendero', joinDate: '2024-01-14' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'Cliente', joinDate: '2024-01-13' },
  ];

  // Órdenes recientes
  recentOrders = [
    { id: 1001, user: 'Juan Pérez', amount: 250.00, status: 'completed' },
    { id: 1002, user: 'María García', amount: 180.50, status: 'pending' },
    { id: 1003, user: 'Carlos López', amount: 420.30, status: 'processing' },
  ];

  constructor() {}

  ngOnInit(): void {
    this._loadUserInfo();
    this._loadStatistics();
  }

  private _loadUserInfo(): void {
    // Decodificar token y obtener nombre
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload.name || payload.unique_name || payload.email || 'Administrador';
        this.userEmail = payload.email || '';
      } catch (e) {
        console.error('Error decodificando token', e);
      }
    }
  }

  private _loadStatistics(): void {
    // TODO: Llamar a AdminService para obtener estadísticas
    console.log('Cargando estadísticas del administrador...');
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  }
}
