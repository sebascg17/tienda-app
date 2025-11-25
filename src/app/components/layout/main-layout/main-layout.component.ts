import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html', // ✅ Usamos archivo HTML externo
})
export class MainLayoutComponent {
  currentYear: number = new Date().getFullYear();
}
