import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { provideHttpClient } from '@angular/common/http';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then((m) => m.LoginComponent),
    providers: [provideHttpClient()],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/auth/register/register.component').then((m) => m.RegisterComponent),
  },
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
        canActivate: [AuthGuard], // 🔑 Aplicación de la Guardia
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
