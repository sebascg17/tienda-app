import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../../core/services/auth/firebase-auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule
  ],
  providers: [
    FirebaseAuthService
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  email = '';
  password = ''; // Restored property
  loginRole: string = 'Cliente'; // Default role for UI
  registerLink: string = '/client/register'; // Dynamic register link

  constructor(
    private firebaseAuth: FirebaseAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Detectar Rol desde la Ruta
    this.route.data.subscribe((data: any) => {
      if (data['role']) {
        this.loginRole = data['role'];
        this.updateRegisterLink(data['role']);
      }
    });
    // 🌍 Manejar el retorno de Facebook/Microsoft (Redirect)
    this.firebaseAuth.handleRedirectResult().then(apiObservable => {
      if (apiObservable) {
        apiObservable.subscribe({
          next: (response: any) => {
            // Guardar token y redirigir
            this.handleLoginSuccess(response);
          },
          error: (err: any) => console.error('Error valida token tras redirect:', err)
        });
      }
    });

    // Validar si ya hay sesión (opcional)
    if (localStorage.getItem('jwt_token')) {
      // Podríamos redirigir automáticamente si el token es válido
    }
  }

  loginEmail() {
    const payload = { email: this.email, password: this.password };
    this.http.post('http://localhost:5237/api/Usuarios/login', payload).subscribe({
      next: (response: any) => {
        this.handleLoginSuccess(response);
      },
      error: (err) => {
        console.error('Login fallido', err);
        alert('Credenciales inválidas');
      }
    });
  }

  // Lógica centralizada de redirección
  private handleLoginSuccess(response: any) {
    const roles = response.roles || [];

    // --- VALIDACIÓN DE ROL ---
    // Si estamos en una página específica (loginRole definido), verificar que el usuario tenga ese rol.
    if (this.loginRole) {
      const rolEsperado = this.loginRole; // 'Cliente', 'Tendero', 'Admin'

      // Nota: Backend devuelve 'Tendero' pero a veces frontend usa 'Vendedor'? 
      // Asumiendo consistencia: 'Cliente', 'Tendero', 'Admin'.

      if (!roles.includes(rolEsperado)) {
        alert(`Error: Esta cuenta no tiene permisos de ${rolEsperado}. Por favor inicia sesión con una cuenta válida.`);
        // Limpiar lo que se haya podido guardar (aunque localStorage.setItem fue movido abajo)
        localStorage.removeItem('jwt_token');
        return; // Detener flujo
      }
    }
    // -------------------------

    // Si pasa la validación, guardar token
    localStorage.setItem('jwt_token', response.token);

    // Redirección basada en el contexto de la página actual (loginRole)
    // Esto asegura que si entro por Login Cliente, vaya al Dashboard Cliente (si tengo permiso)
    // en lugar de saltar al Dashboard Admin por tener ese rol extra.
    if (this.loginRole === 'Tendero') {
      this.router.navigate(['/tendero']);
    } else if (this.loginRole === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (this.loginRole === 'Cliente') {
      this.router.navigate(['/cliente']);
    } else {
      // Fallback: Si no hay contexto definido, usar jerarquía por defecto
      if (roles.includes('Admin')) {
        this.router.navigate(['/admin']);
      } else if (roles.includes('Tendero')) {
        this.router.navigate(['/tendero']);
      } else {
        this.router.navigate(['/cliente']);
      }
    }
  }

  loginGoogle() {
    this.firebaseAuth.signInWithGoogle()
      .then(apiObservable => {
        apiObservable.subscribe({
          next: (response: any) => {
            this.handleLoginSuccess(response);
          },
          error: (err: any) => {
            console.error('Error del Backend al validar el token de Google:', err);
          }
        });
      })
      .catch(err => {
        console.error('Fallo en la autenticación de Firebase (Google):', err);
      });
  }

  // Ahora solo inician el flujo de Redirect (no devuelven observable aquí)
  loginFacebook() {
    this.firebaseAuth.signInWithFacebook()
      .catch(err => console.error('Fallo inicio Facebook:', err));
  }

  loginMicrosoft() {
    this.firebaseAuth.signInWithMicrosoft()
      .catch(err => console.error('Fallo inicio Microsoft:', err));
  }

  updateRegisterLink(role: string) {
    if (role === 'Tendero') {
      this.registerLink = '/store/register';
    } else if (role === 'Cliente') {
      this.registerLink = '/client/register';
    } else if (role === 'Admin') {
      this.registerLink = '/admin/register';
    } else {
      this.registerLink = '/client/register';
    }
  }
}