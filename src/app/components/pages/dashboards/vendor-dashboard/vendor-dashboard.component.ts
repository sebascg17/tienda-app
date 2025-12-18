import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit {
  
  // Datos del usuario
  userName: string = 'Vendedor';
  userEmail: string = '';

  // Estadísticas de la tienda
  vendorStats = {
    totalProducts: 142,
    totalOrders: 287,
    totalSales: 15240.50,
    averageRating: 4.8
  };

  // Productos principales
  topProducts = [
    { id: 1, name: 'Laptop Dell XPS 13', sales: 34, rating: 4.9, price: 1200 },
    { id: 2, name: 'Mouse Logitech MX Master', sales: 28, rating: 4.7, price: 99 },
    { id: 3, name: 'Teclado Mecánico Corsair', sales: 22, rating: 4.6, price: 150 },
  ];

  // Órdenes pendientes
  pendingOrders = [
    { id: 1001, buyer: 'Juan Pérez', amount: 250.00, date: '2024-01-20', status: 'pending' },
    { id: 1002, buyer: 'María García', amount: 180.50, date: '2024-01-19', status: 'processing' },
  ];

  constructor() {}

  ngOnInit(): void {
    this._loadUserInfo();
    this._loadVendorData();
  }

  private _loadUserInfo(): void {
    // Decodificar token y obtener nombre
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload.name || payload.unique_name || payload.email || 'Vendedor';
        this.userEmail = payload.email || '';
      } catch (e) {
        console.error('Error decodificando token', e);
      }
    }
  }

  private _loadVendorData(): void {
    // TODO: Llamar a VendorService para obtener datos de la tienda
    console.log('Cargando datos de la tienda...');
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
