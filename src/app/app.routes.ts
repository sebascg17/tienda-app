import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { provideHttpClient } from '@angular/common/http';


export const routes: Routes = [
  {
    path: 'login', // Legacy/Generic
    loadComponent: () =>
      import('./components/auth/login/login.component').then((m) => m.LoginComponent),
    providers: [provideHttpClient()],
  },
  {
    path: 'store/login',
    data: { role: 'Tendero' },
    loadComponent: () =>
      import('./components/auth/login/login.component').then((m) => m.LoginComponent),
    providers: [provideHttpClient()],
  },
  {
    path: 'client/login',
    data: { role: 'Cliente' },
    loadComponent: () =>
      import('./components/auth/login/login.component').then((m) => m.LoginComponent),
    providers: [provideHttpClient()],
  },
  {
    path: 'admin/login',
    data: { role: 'Admin' },
    loadComponent: () =>
      import('./components/auth/login/login.component').then((m) => m.LoginComponent),
    providers: [provideHttpClient()],
  },
  {
    path: 'register', // Registro genérico (Legacy/Admin)
    loadComponent: () =>
      import('./components/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'store/register',
    data: { role: 'Tendero' },
    loadComponent: () =>
      import('./components/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'client/register',
    data: { role: 'Cliente' },
    loadComponent: () =>
      import('./components/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'admin/register',
    data: { role: 'Admin' },
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
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./components/pages/pedidos/pedidos.component').then((m) => m.PedidosComponent),
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./components/pages/contacto/contacto.component').then((m) => m.ContactoComponent),
      },
      // 🛡️ RUTAS POR ROL
      // 🛡️ PLATAFORMA ADMIN
      {
        path: 'admin',
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'Admin' },
        loadComponent: () =>
          import('./components/pages/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
      },

      // 🛡️ PLATAFORMA STORE (TENDERO)
      {
        path: 'store',
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'Tendero' },
        loadComponent: () =>
          import('./components/pages/dashboard/vendor-dashboard.component').then((m) => m.VendorDashboardComponent),
      },

      // 🛡️ PLATAFORMA CLIENTE
      {
        path: 'client',
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'Cliente' },
        loadComponent: () =>
          import('./components/pages/dashboard/client-dashboard.component').then((m) => m.ClientDashboardComponent),
      },
      {
        path: 'dashboard',
        redirectTo: 'client',
        pathMatch: 'full'
      }
    ],
  },
  { path: '**', redirectTo: '' },
];
