import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './components/ui/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Importando LoadingComponent (Standalone)
  imports: [RouterOutlet, LoadingComponent],
  template: `
    <app-loading></app-loading>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent { }
