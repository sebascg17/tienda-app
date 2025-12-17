import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Panel de Administrador</h1>
          <p class="text-gray-500 dark:text-gray-400">Gestión global de SBENIX</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Administrador</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <p-card header="Métricas Globales (KPI)"
          styleClass="h-full shadow bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h2 class="text-4xl font-bold">98%</h2>
          <p class="text-blue-100">Rendimiento General</p>
        </p-card>
        <p-card header="Usuarios Activos" styleClass="h-full shadow dark:bg-gray-800 dark:text-white">
          <h2 class="text-4xl font-bold text-gray-800 dark:text-white">120</h2>
          <p class="text-green-500 font-bold"><i class="pi pi-arrow-up"></i> +5% esta semana</p>
        </p-card>
        <p-card header="Ingresos por Comisiones" styleClass="h-full shadow dark:bg-gray-800 dark:text-white">
          <h2 class="text-4xl font-bold text-gray-800 dark:text-white">50,000 COP</h2>
          <p class="text-gray-500 dark:text-gray-400">Total acumulado</p>
        </p-card>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">CRUD de Administrador</h3>
          <p class="text-gray-600 dark:text-gray-300">Aquí irán las herramientas de gestión de admin.</p>
      </div>
    </div>
  `
})
export class AdminDashboardComponent { }
