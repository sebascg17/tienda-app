import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMsg = '';
  errorType: 'error' | 'warning' = 'error'; // Tipo de error para estilos
  showPassword = false;
  showConfirmPassword = false;
  isRoleFixed = false; // Nueva propiedad
  loginLink = '/login'; // Link dinámico de login
  registerRole = 'Cliente'; // Rol del registro (Cliente, Tendero, Admin)

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute // Inyectar ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();

    // Verificar si hay un rol predefinido en la ruta (data)
    this.route.data.subscribe(data => {
      if (data['role']) {
        this.isRoleFixed = true;
        this.registerRole = data['role']; // Actualizar registerRole
        this.registerForm.patchValue({ rol: data['role'] });
        this.updateValidators(data['role']);

        // Actualizar el link de login según el rol
        this.updateLoginLink(data['role']);
      }
    });
  }

  updateLoginLink(role: string) {
    if (role === 'Tendero') {
      this.loginLink = '/store/login';
    } else if (role === 'Cliente') {
      this.loginLink = '/client/login';
    } else if (role === 'Admin') {
      this.loginLink = '/admin/login';
    } else {
      this.loginLink = '/login';
    }
  }

  initForm() {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      rol: ['Cliente', [Validators.required]],
      // Campos para Tendero
      nombreTienda: [''],
      pais: [''],
      departamento: [''],
      ciudad: [''],
      barrio: [''],
      direccion: ['']
    }, { validators: this.passwordMatchValidator });

    // Escuchar cambios en el rol para validaciones dinámicas
    this.registerForm.get('rol')?.valueChanges.subscribe(rol => {
      this.updateValidators(rol);
    });
  }

  updateValidators(rol: string) {
    const nombreTiendaControl = this.registerForm.get('nombreTienda');
    const paisControl = this.registerForm.get('pais');
    const departamentoControl = this.registerForm.get('departamento');
    const ciudadControl = this.registerForm.get('ciudad');
    const barrioControl = this.registerForm.get('barrio');
    const direccionControl = this.registerForm.get('direccion');

    if (rol === 'Tendero') {
      nombreTiendaControl?.setValidators([Validators.required]);
      paisControl?.setValidators([Validators.required]);
      departamentoControl?.setValidators([Validators.required]);
      ciudadControl?.setValidators([Validators.required]);
      barrioControl?.setValidators([Validators.required]);
      direccionControl?.setValidators([Validators.required]);
    } else {
      nombreTiendaControl?.clearValidators();
      paisControl?.clearValidators();
      departamentoControl?.clearValidators();
      ciudadControl?.clearValidators();
      barrioControl?.clearValidators();
      direccionControl?.clearValidators();
    }
    nombreTiendaControl?.updateValueAndValidity();
    paisControl?.updateValueAndValidity();
    departamentoControl?.updateValueAndValidity();
    ciudadControl?.updateValueAndValidity();
    barrioControl?.updateValueAndValidity();
    direccionControl?.updateValueAndValidity();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.value;
    const rol = formValue.rol;

    // Determinar el endpoint correcto según el rol
    let url = '';
    let body: any = {
      nombre: formValue.nombre,
      email: formValue.email,
      password: formValue.password
    };

    if (rol === 'Tendero') {
      url = `${environment.apiUrl}Usuarios/register-store`;
      body = {
        ...body,
        nombreTienda: formValue.nombreTienda,
        pais: formValue.pais,
        departamento: formValue.departamento,
        ciudad: formValue.ciudad,
        barrio: formValue.barrio,
        direccion: formValue.direccion
      };
    } else if (rol === 'Cliente') {
      url = `${environment.apiUrl}Usuarios/register-client`;
    } else if (rol === 'Admin') {
      url = `${environment.apiUrl}Usuarios/register-admin-temp`;
    } else {
      this.errorMsg = 'Rol no válido';
      return;
    }

    console.log('Enviando registro a:', url, body);

    this.http.post(url, body).subscribe({
      next: (res) => {
        console.log('Registro exitoso:', res);
        this.router.navigate([this.loginLink]);
      },
      error: (err) => {
        console.error('Error en registro:', err);

        // Manejo específico de errores
        if (err.status === 409 || (err.error && err.error.includes && err.error.includes('ya existe'))) {
          // Usuario ya existe
          this.errorMsg = '⚠️ Este correo electrónico ya está registrado. Por favor, inicia sesión o usa otro correo.';
          this.errorType = 'warning';
        } else if (err.status === 400) {
          // Bad Request - Datos inválidos
          this.errorMsg = err.error?.message || 'Los datos proporcionados no son válidos. Verifica e intenta nuevamente.';
          this.errorType = 'error';
        } else if (err.status >= 500) {
          // Error del servidor
          this.errorMsg = '🔧 Error del sistema. Por favor, contacta al desarrollador o intenta más tarde.';
          this.errorType = 'error';
        } else if (err.error && typeof err.error === 'string') {
          this.errorMsg = err.error;
          this.errorType = 'error';
        } else if (err.error && err.error.message) {
          this.errorMsg = err.error.message;
          this.errorType = 'error';
        } else {
          this.errorMsg = 'No se pudo completar el registro. Intenta nuevamente.';
          this.errorType = 'error';
        }
      }
    });
  }

  // Getters para el template
  get f() { return this.registerForm.controls; }
  get isTendero() { return this.registerForm.get('rol')?.value === 'Tendero'; }
}
