import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { LocationService } from '../../../core/services/location.service';

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

  // Listas para selectores geográficos
  paises: any[] = [];
  departamentos: any[] = [];
  municipios: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute, // Inyectar ActivatedRoute
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.cargarPaises(); // Cargar países al iniciar

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

      // Campos Comunes (Paso 1 - Simplificado)
      pais: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      codigoPais: ['+57'],
      telefono: [''],
      fechaNacimiento: ['']
    }, { validators: this.passwordMatchValidator });

    // Escuchar cambios en el rol para validaciones dinámicas
    this.registerForm.get('rol')?.valueChanges.subscribe(rol => {
      this.updateValidators(rol);
    });
  }

  updateValidators(rol: string) {
    // Ya no hay campos condicionales obligatorios para el registro inicial
    // Ambos roles (Cliente/Tendero) solo requieren los campos básicos ya definidos.
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

  // --- Lógica de Geografía en Cascada ---

  cargarPaises() {
    this.locationService.getPaises().subscribe((data: any[]) => {
      this.paises = data;
      // Seleccionar Colombia por defecto
      const colombia = this.paises.find(p => p.nombre === 'Colombia');
      if (colombia) {
        this.registerForm.patchValue({ pais: colombia.nombre });
        this.onPaisChange({ target: { value: colombia.nombre } }); // Cargar deptos
        // Setear código telefónico por defecto si el campo está vacío
        if (!this.registerForm.get('telefono')?.value) {
          // Nota: Aquí podrías concatenar el prefijo. Por ahora solo dejamos 'Colombia' seleccionado.
        }
      }
    });
  }

  onPaisChange(event: any) {
    // El value del select es el NOMBRE del país (string), pero necesitamos el ID para buscar deptos
    const nombrePais = event.target.value || event.value; // event.value si es PrimeNG, target.value nativo
    const paisSeleccionado = this.paises.find(p => p.nombre === nombrePais);

    this.departamentos = [];
    this.municipios = [];
    this.registerForm.patchValue({ departamento: '', ciudad: '' }); // Reset hijos

    if (paisSeleccionado) {
      this.locationService.getDepartamentos(paisSeleccionado.id).subscribe((data: any[]) => {
        this.departamentos = data;
        // Auto-select phone code based on country
        if (paisSeleccionado.codigo) {
          this.registerForm.patchValue({ codigoPais: paisSeleccionado.codigo });
        }
      });
    }
  }

  onDepartamentoChange(event: any) {
    const nombreDepto = event.target.value || event.value;
    const deptoSeleccionado = this.departamentos.find(d => d.nombre === nombreDepto);

    this.municipios = [];
    this.registerForm.patchValue({ ciudad: '' }); // Reset ciudad

    if (deptoSeleccionado) {
      this.locationService.getMunicipios(deptoSeleccionado.id).subscribe((data: any[]) => {
        this.municipios = data;
      });
    }
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.value;
    const rol = formValue.rol;

    // Determinar payload común
    let url = '';

    // Concatenar código de país con el teléfono si ambos existen
    let telefonoFinal = formValue.telefono;
    if (formValue.codigoPais && formValue.telefono) {
      telefonoFinal = `${formValue.codigoPais} ${formValue.telefono}`;
    }

    let body: any = {
      nombre: formValue.nombre,
      email: formValue.email,
      password: formValue.password,
      rol: rol, // Importante para el endpoint genérico
      pais: formValue.pais,
      ciudad: formValue.ciudad,
      telefono: telefonoFinal,
      fechaNacimiento: formValue.fechaNacimiento ? new Date(formValue.fechaNacimiento) : null
    };

    // Lógica Simplificada: Todos usan el endpoint genérico /register
    if (rol === 'Tendero' || rol === 'Cliente') {
      url = `${environment.apiUrl}Usuarios/register`;
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
          if (typeof err.error === 'string') {
            this.errorMsg = err.error;
          } else {
            this.errorMsg = err.error?.message || 'Los datos proporcionados no son válidos. Verifica e intenta nuevamente.';
          }
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
