import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../core/services/producto.service';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean = false;
  productoDestacados: any[] = [];
  isLoading: boolean = false;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private i18nService: I18nService
  ) {}

  ngOnInit() {
    this.checkLoginStatus();
    if (this.isAuthenticated) {
      this.loadDestacados();
    }
  }

  /**
   * Verificar si usuario está logueado
   */
  checkLoginStatus() {
    const token = localStorage.getItem('jwt_token');
    this.isAuthenticated = !!token;
  }

  /**
   * Cargar productos destacados desde API
   */
  loadDestacados() {
    this.isLoading = true;
    this.productoService.getProductosDestacados().subscribe(
      (data: any[]) => {
        this.productoDestacados = data.slice(0, 6); // Top 6
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error cargando productos destacados:', error);
        this.isLoading = false;
      }
    );
  }

  /**
   * Navegar a detalles de producto
   */
  viewProduct(productId: number) {
    this.router.navigate(['/productos', productId]);
  }
}
