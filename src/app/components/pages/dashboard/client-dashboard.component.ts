import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, RouterLink],
  template: `
    <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Mi Cuenta</h1>
          <p class="text-gray-500 dark:text-gray-400">Tus pedidos y favoritos</p>
        </div>
         <div class="flex items-center gap-3">
          <span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">Cliente</span>
        </div>
      </div>

      <div class="w-full">
        <p-card header="Mis Pedidos en Curso" styleClass="shadow-lg mb-6 dark:bg-gray-800 dark:text-white">
          <div class="text-center text-gray-500 dark:text-gray-400 py-8">
            <i class="pi pi-shopping-cart text-4xl mb-3 text-gray-300 dark:text-gray-600"></i>
            <p>No tienes pedidos en curso actualmente.</p>
            <button routerLink="/productos" class="mt-4 px-4 py-2 bg-[#08d15f] text-white rounded-lg hover:bg-green-600 transition">
              Ir a comprar
            </button>
          </div>
        </p-card>

        <p-card header="Historial de Pedidos" styleClass="shadow-lg dark:bg-gray-800 dark:text-white">
          <div class="text-center text-gray-500 dark:text-gray-400 py-4">
            <p>Aquí aparecerá tu historial de compras.</p>
          </div>
        </p-card>
      </div>
    </div>
  `
})
export class ClientDashboardComponent { }
