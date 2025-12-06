import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule],
  template: `
    <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Panel de Vendedor</h1>
          <p class="text-gray-500 dark:text-gray-400">Gestiona tu tienda y pedidos</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Tendero</span>
        </div>
      </div>

      <div *ngIf="loading" class="flex justify-center items-center h-64">
        <i class="pi pi-spin pi-spinner text-4xl text-[#08d15f]"></i>
      </div>

      <div *ngIf="!loading && metrics">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Ventas Totales -->
          <p-card styleClass="h-full shadow-lg border-l-4 border-blue-500 dark:bg-gray-800 dark:text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 dark:text-gray-400 font-medium mb-1">Ganancias</p>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ metrics.ventasTotales | currency:'COP':'symbol-narrow':'1.0-0' }}</h2>
              </div>
              <div class="bg-blue-100 p-3 rounded-full">
                <i class="pi pi-dollar text-blue-600 text-xl"></i>
              </div>
            </div>
          </p-card>

          <!-- Productos Activos -->
          <p-card styleClass="h-full shadow-lg border-l-4 border-green-500 dark:bg-gray-800 dark:text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 dark:text-gray-400 font-medium mb-1">Inventario Rápido</p>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ metrics.productosActivos }}</h2>
              </div>
              <div class="bg-green-100 p-3 rounded-full">
                <i class="pi pi-box text-green-600 text-xl"></i>
              </div>
            </div>
          </p-card>

          <!-- Saldo Actual -->
          <p-card styleClass="h-full shadow-lg border-l-4 border-purple-500 dark:bg-gray-800 dark:text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 dark:text-gray-400 font-medium mb-1">Saldo Disponible</p>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ metrics.saldo | currency:'COP':'symbol-narrow':'1.0-0' }}</h2>
              </div>
              <div class="bg-purple-100 p-3 rounded-full">
                <i class="pi pi-wallet text-purple-600 text-xl"></i>
              </div>
            </div>
          </p-card>

          <!-- Pedidos Pendientes -->
          <p-card styleClass="h-full shadow-lg border-l-4 border-orange-500 dark:bg-gray-800 dark:text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 dark:text-gray-400 font-medium mb-1">Pedidos Activos</p>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ metrics.pedidosRecientes.length }}</h2>
              </div>
              <div class="bg-orange-100 p-3 rounded-full">
                <i class="pi pi-clock text-orange-600 text-xl"></i>
              </div>
            </div>
          </p-card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <!-- Gráfico y Tabla aquí (simplificado para brevedad, se puede expandir) -->
           <div class="lg:col-span-3">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">CRUD de Tendero</h3>
                  <p class="text-gray-600 dark:text-gray-300">Aquí irán las herramientas de gestión de productos y pedidos.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  `
})
export class VendorDashboardComponent implements OnInit {
  metrics: any;
  loading = true;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    // Mock Tienda ID 1
    this.dashboardService.getVendorDashboard(1).subscribe({
      next: (data) => {
        this.metrics = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
