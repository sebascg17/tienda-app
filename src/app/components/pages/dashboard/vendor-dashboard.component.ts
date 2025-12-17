import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreService } from '../../../core/services/store.service';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule, DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  template: `
    <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      
      <!-- HEADER -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Panel de Tendero</h1>
          <p class="text-gray-500 dark:text-gray-400">Gestiona tus tiendas y pedidos</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Tendero</span>
        </div>
      </div>

      <!-- LOADING -->
      <div *ngIf="loading" class="flex justify-center items-center h-64">
        <i class="pi pi-spin pi-spinner text-4xl text-[#08d15f]"></i>
      </div>

      <!-- CONTENIDO PRINCIPAL -->
      <div *ngIf="!loading">

        <!-- CASO 1: NO TIENE TIENDAS (EMPTY STATE) -->
        <div *ngIf="stores.length === 0" class="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div class="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-4">
            <i class="pi pi-shop text-4xl text-green-600 dark:text-green-400"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">¡Bienvenido a Sfenix!</h2>
          <p class="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
            Aún no tienes ninguna tienda registrada. Crea tu primera tienda para comenzar a vender.
          </p>
          <button pButton label="Crear Mi Primera Tienda" icon="pi pi-plus" 
            class="p-button-rounded p-button-lg bg-[#08d15f] hover:bg-[#06b050] border-none"
            (click)="showCreateStoreModal = true"></button>
        </div>

        <!-- CASO 2: TIENE TIENDAS (DASHBOARD COMPLETO) -->
        <div *ngIf="stores.length > 0">
           <!-- SELECTOR DE TIENDA (Si tiene múltiples) -->
           <div class="mb-6 flex gap-4 overflow-x-auto pb-2">
             <div *ngFor="let tienda of stores" 
                class="min-w-[200px] p-4 rounded-lg cursor-pointer border-2 transition-all"
                [ngClass]="{'border-[#08d15f] bg-green-50 dark:bg-green-900/10': currentStore?.id === tienda.id, 'border-transparent bg-white dark:bg-gray-800 hover:border-gray-300': currentStore?.id !== tienda.id}"
                (click)="selectStore(tienda)">
                <h3 class="font-bold text-gray-800 dark:text-white">{{tienda.nombre}}</h3>
                <span class="text-xs px-2 py-0.5 rounded-full" 
                  [ngClass]="{'bg-yellow-100 text-yellow-800': tienda.estado === 'inactivo', 'bg-green-100 text-green-800': tienda.estado === 'activo'}">
                  {{ tienda.estado | titlecase }}
                </span>
             </div>
             <!-- Botón para agregar otra tienda -->
             <div class="min-w-[50px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                (click)="showCreateStoreModal = true" title="Crear otra tienda">
                <i class="pi pi-plus text-gray-500 text-xl"></i>
             </div>
           </div>

           <!-- METRICAS (Solo si hay tienda seleccionada) -->
           <div *ngIf="currentStore && metrics" class="animate-fade-in-up">
              <!-- Reutilizamos el grid de métricas existente -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <!-- Ventas -->
                  <p-card styleClass="h-full shadow-lg border-l-4 border-blue-500 dark:bg-gray-800 dark:text-white">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 font-medium mb-1">Ganancias</p>
                        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ metrics.ventasTotales | currency:'COP':'symbol-narrow':'1.0-0' }}</h2>
                      </div>
                      <div class="bg-blue-100 p-3 rounded-full"><i class="pi pi-dollar text-blue-600 text-xl"></i></div>
                    </div>
                  </p-card>
                  <!-- Inventario -->
                  <p-card styleClass="h-full shadow-lg border-l-4 border-green-500 dark:bg-gray-800 dark:text-white">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 font-medium mb-1">Inventario</p>
                        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ metrics.productosActivos }}</h2>
                      </div>
                      <div class="bg-green-100 p-3 rounded-full"><i class="pi pi-box text-green-600 text-xl"></i></div>
                    </div>
                  </p-card>
                  <!-- Saldo -->
                  <p-card styleClass="h-full shadow-lg border-l-4 border-purple-500 dark:bg-gray-800 dark:text-white">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 font-medium mb-1">Saldo</p>
                        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ metrics.saldo | currency:'COP':'symbol-narrow':'1.0-0' }}</h2>
                      </div>
                      <div class="bg-purple-100 p-3 rounded-full"><i class="pi pi-wallet text-purple-600 text-xl"></i></div>
                    </div>
                  </p-card>
                  <!-- Pedidos -->
                  <p-card styleClass="h-full shadow-lg border-l-4 border-orange-500 dark:bg-gray-800 dark:text-white">
                    <div class="flex items-center justify-between">
                      <div>
                         <p class="text-gray-500 dark:text-gray-400 font-medium mb-1">Pedidos</p>
                         <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ metrics.pedidosRecientes?.length || 0 }}</h2>
                      </div>
                      <div class="bg-orange-100 p-3 rounded-full"><i class="pi pi-clock text-orange-600 text-xl"></i></div>
                    </div>
                  </p-card>
              </div>

              <!-- Mensaje si la tienda está inactiva -->
              <div *ngIf="currentStore.estado === 'inactivo'" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <i class="pi pi-exclamation-triangle text-yellow-400"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-yellow-700">
                      Tu tienda <strong>{{currentStore.nombre}}</strong> está en revisión. No podrás recibir pedidos hasta que sea aprobada.
                    </p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div class="lg:col-span-3">
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Gestión de Tienda: {{currentStore.nombre}}</h3>
                        <p class="text-gray-600 dark:text-gray-300">Aquí irán las herramientas de gestión de productos y pedidos.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <!-- MODAL CREAR TIENDA -->
      <p-dialog header="Crear Nueva Tienda" [(visible)]="showCreateStoreModal" [modal]="true" [style]="{width: '50vw'}" [draggable]="false" [resizable]="false">
        <form [formGroup]="createStoreForm" (ngSubmit)="submitStore()" class="space-y-4 pt-4">
          
          <div class="field">
            <label for="nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de la Tienda</label>
            <input id="nombre" type="text" pInputText formControlName="nombre" class="w-full mt-1" placeholder="Ej: Moda Sfenix">
            <small *ngIf="createStoreForm.get('nombre')?.invalid && createStoreForm.get('nombre')?.touched" class="text-red-500">El nombre es obligatorio.</small>
          </div>

          <div class="field">
            <label for="direccion" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Dirección del Local Físico</label>
            <input id="direccion" type="text" pInputText formControlName="direccion" class="w-full mt-1" placeholder="Ej: Calle 10 # 45-30">
            <small *ngIf="createStoreForm.get('direccion')?.invalid && createStoreForm.get('direccion')?.touched" class="text-red-500">La dirección es obligatoria.</small>
          </div>

           <div class="field">
            <label for="descripcion" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción (Opcional)</label>
            <textarea id="descripcion" pInputTextarea formControlName="descripcion" rows="3" class="w-full mt-1 bg-white dark:bg-gray-700 border-gray-300 rounded-md"></textarea>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <button pButton type="button" label="Cancelar" class="p-button-text text-gray-600" (click)="showCreateStoreModal = false"></button>
            <button pButton type="submit" label="Crear Tienda" class="bg-[#08d15f] border-none" [disabled]="createStoreForm.invalid || isSubmitting"></button>
          </div>
        </form>
      </p-dialog>

    </div>
  `
})
export class VendorDashboardComponent implements OnInit {
  stores: any[] = [];
  currentStore: any = null;
  metrics: any = null; // Métricas de la tienda seleccionada
  loading = true;
  showCreateStoreModal = false;
  createStoreForm: FormGroup;
  isSubmitting = false;

  constructor(
    private dashboardService: DashboardService,
    private storeService: StoreService,
    private fb: FormBuilder
  ) {
    this.createStoreForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit() {
    this.loadStores();
  }

  loadStores() {
    this.loading = true;
    this.storeService.getMyStores().subscribe({
      next: (data) => {
        this.stores = data;
        this.loading = false;
        if (this.stores.length > 0) {
          // Seleccionar la primera tienda por defecto
          this.selectStore(this.stores[0]);
        } else {
          // No hay tiendas, se mostrará el empty state
        }
      },
      error: (err) => {
        console.error('Error cargando tiendas', err);
        this.loading = false;
      }
    });
  }

  selectStore(store: any) {
    this.currentStore = store;
    // Cargar métricas específicas de esta tienda (Simulado por ahora usando el ID de la tienda)
    // En el futuro dashboardService.getStoreMetrics(store.id)
    this.dashboardService.getVendorDashboard(store.id).subscribe({
      next: (data) => {
        this.metrics = data;
      },
      error: (err) => console.error(err)
    });
  }

  submitStore() {
    if (this.createStoreForm.invalid) return;

    this.isSubmitting = true;
    this.storeService.createStore(this.createStoreForm.value).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.showCreateStoreModal = false;
        this.createStoreForm.reset();
        alert('Tienda creada exitosamente!');
        this.loadStores(); // Recargar lista
      },
      error: (err) => {
        this.isSubmitting = false;
        alert('Error al crear la tienda.');
        console.error(err);
      }
    });
  }
}
