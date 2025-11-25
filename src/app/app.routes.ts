import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./components/pages/productos/productos.component').then((m) => m.ProductosComponent),
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./components/pages/categorias/categorias.component').then((m) => m.CategoriasComponent),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./components/pages/pedidos/pedidos.component').then((m) => m.PedidosComponent),
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./components/pages/contacto/contacto.component').then((m) => m.ContactoComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
