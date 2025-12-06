import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  metrics: any = null;
  loading = true;
  chartData: any;
  chartOptions: any;

  userRole: 'Admin' | 'Vendedor' | 'Cliente' | null = null;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.determineUserRole();
    this.loadDashboard();
    this.initChartOptions();
  }

  determineUserRole() {
    // TODO: Implementar decodificación real del token JWT para obtener "role"
    // Por ahora simulamos un rol o leemos del localStorage si lo guardaste
    // const token = localStorage.getItem('jwt_token');
    // ... decode logic ...

    // MOCK para desarrollo (Cambiar según necesidad de prueba)
    this.userRole = 'Vendedor';
  }

  loadDashboard(): void {
    if (this.userRole === 'Vendedor') {
      this.loadVendorDashboard();
    } else if (this.userRole === 'Admin') {
      this.loadAdminDashboard(); // Implementar en servicio
    } else if (this.userRole === 'Cliente') {
      // Cargar historial
      this.loading = false;
    } else {
      this.loading = false;
    }
  }

  loadVendorDashboard() {
    // TODO: Obtener TiendaId real
    const tiendaId = 1;
    this.dashboardService.getVendorDashboard(tiendaId).subscribe({
      next: (data) => {
        this.metrics = data;
        this.loading = false;
        this.initChartData();
      },
      error: (err) => {
        console.error('Error loading dashboard', err);
        this.loading = false;
      }
    });
  }

  loadAdminDashboard() {
    // Mock data for Admin
    this.metrics = {
      usuariosActivos: 120,
      ingresosTotales: 50000,
      kpiGlobal: '98%'
    };
    this.loading = false;
  }

  initChartData(): void {
    if (!this.metrics || !this.metrics.statsPedidos) return;

    const labels = this.metrics.statsPedidos.map((s: any) => this.getEstadoLabel(s.estado));
    const data = this.metrics.statsPedidos.map((s: any) => s.cantidad);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }
      ]
    };
  }

  initChartOptions(): void {
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#495057'
          }
        }
      }
    };
  }

  getEstadoLabel(estado: number): string {
    const estados = ['Pendiente', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado'];
    return estados[estado] || 'Desconocido';
  }
}
