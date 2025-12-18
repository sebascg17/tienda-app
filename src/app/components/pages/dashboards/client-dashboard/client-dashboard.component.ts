import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  
  // Datos del usuario
  userName: string = 'Cliente';
  userEmail: string = '';

  // Información del cliente
  clientStats = {
    totalOrders: 12,
    totalSpent: 3540.50,
    wishlistItems: 5,
    loyaltyPoints: 2340
  };

  // Órdenes recientes
  recentOrders = [
    { id: 1001, date: '2024-01-20', items: 2, total: 250.00, status: 'completed' },
    { id: 1002, date: '2024-01-15', items: 1, total: 180.50, status: 'completed' },
    { id: 1003, date: '2024-01-10', items: 3, total: 420.30, status: 'completed' },
  ];

  // Recomendaciones
  recommendations = [
    { id: 101, name: 'Monitor LG 27"', price: 350, rating: 4.8 },
    { id: 102, name: 'Webcam HD Logitech', price: 89, rating: 4.6 },
    { id: 103, name: 'Auriculares Sony', price: 200, rating: 4.9 },
  ];

  constructor() {}

  ngOnInit(): void {
    this._loadUserInfo();
    this._loadClientData();
  }

  private _loadUserInfo(): void {
    // Decodificar token y obtener nombre
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload.name || payload.unique_name || payload.email || 'Cliente';
        this.userEmail = payload.email || '';
      } catch (e) {
        console.error('Error decodificando token', e);
      }
    }
  }

  private _loadClientData(): void {
    // TODO: Llamar a ClientService para obtener datos del cliente
    console.log('Cargando datos del cliente...');
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  }
}
