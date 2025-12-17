import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './components/ui/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Importando LoadingComponent (Standalone)
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { }
