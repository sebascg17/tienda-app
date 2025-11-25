import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categoria, CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Categorías</h2>
    <ul>
      <li *ngFor="let cat of categorias">{{ cat.nombre }}</li>
    </ul>
  `
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.categoriaService.getCategorias()
      .subscribe(data => this.categorias = data);
  }
}
