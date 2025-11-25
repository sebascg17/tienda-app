import { Component } from '@angular/core';
import { FirebaseAuthService } from '../../../core/services/auth/firebase-auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true, // 👈 Asumo que es standalone
  imports: [
    CommonModule,
    HttpClientModule
  ],// 🔑 Añade el módulo HTTP a nivel de componente
  providers: [
    FirebaseAuthService  // 👈 Esto asegura que el servicio se resuelva aquí
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(
    private firebaseAuth: FirebaseAuthService,
    private router: Router // 👈 Inyecta el Router para redirigir
  ) {}

  loginGoogle() {
    this.firebaseAuth.signInWithGoogle()
      .then(apiObservable => {
        // Ejecutar la petición al Backend
        apiObservable.subscribe({
          next: (response) => {
            // 5. ¡Éxito! Guardar el JWT propio de .NET (response.token)
            localStorage.setItem('jwt_token', response.token);
            console.log('Login exitoso con tu API:', response);
            this.router.navigate(['/pedidos']); // 👈 Redirección
          },
          error: (err) => {
            console.error('Error del Backend al validar el token:', err);
          }
        });
      })
      .catch(err => {
        console.error('Fallo en la autenticación de Firebase:', err);
      });
  }
}