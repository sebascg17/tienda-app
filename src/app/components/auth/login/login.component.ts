import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth/auth.service';
import { FirebaseAuthService } from '../../../core/services/auth/firebase-auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // 1. Propiedades para el formulario
  email = '';
  password = '';
  loginRole: string = 'Cliente';
  registerLink: string = '/register'; // Restaurada para el HTML

  constructor(
    private authService: AuthService,
    private firebaseAuth: FirebaseAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Detectar rol y actualizar link de registro
    this.route.data.subscribe(data => {
      if (data['role']) {
        this.loginRole = data['role'];
        this.updateRegisterLink(data['role']);
      }
    });

    // Manejar retorno de Redirect (Facebook/Microsoft)
    this.firebaseAuth.handleRedirectResult().then(obs => {
      if (obs) {
        obs.subscribe({
          next: (res: any) => this.handleLoginSuccess(res),
          error: (err) => console.error('Error redirect:', err)
        });
      }
    });
  }

  // Login Local (DB)
  loginEmail() {
    const payload = { email: this.email, password: this.password };
    this.authService.loginLocal(payload).subscribe({
      next: (res) => this.handleLoginSuccess(res),
      error: (err) => this.notificationService.showError('Credenciales inválidas', 'Error de Login')
    });
  }

  // Redes Sociales (Restaurados métodos para el HTML)
  loginGoogle() {
    this.firebaseAuth.signInWithGoogle().then(obs => {
      obs.subscribe({
        next: (res) => this.handleLoginSuccess(res),
        error: (err) => console.error('Error Google:', err)
      });
    });
  }

  loginFacebook() {
    this.firebaseAuth.signInWithFacebook().catch(err => console.error(err));
  }

  loginMicrosoft() {
    this.firebaseAuth.signInWithMicrosoft().catch(err => console.error(err));
  }

  // Lógica de éxito y redirección
  private handleLoginSuccess(response: any) {
    const roles = response.roles || [];

    // Validar si el usuario tiene el rol del portal actual
    if (this.loginRole && !roles.includes(this.loginRole)) {
      this.notificationService.showWarning(`No tienes permisos de ${this.loginRole}`, 'Acceso Denegado');
      this.authService.logout();
      return;
    }

    // Guardar sesión en el servicio
    this.authService.saveSession(response);

    // ¡Al Dashboard Dispatcher!
    this.router.navigate(['/dashboard']);
  }

  updateRegisterLink(role: string) {
    const links: { [key: string]: string } = {
      'Tendero': '/store/register',
      'Cliente': '/client/register',
      'Admin': '/admin/register'
    };
    this.registerLink = links[role] || '/register';
  }
}