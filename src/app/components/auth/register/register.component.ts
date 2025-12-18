import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { LocationService } from '../../../core/services/location.service';
import { AuthService } from '../../../core/services/auth/auth.service';

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
  errorType: 'error' | 'warning' = 'error';
  showPassword = false;
  showConfirmPassword = false;
  isRoleFixed = false;
  loginLink = '/login';
  registerRole = 'Cliente';

  // Listas para selectores geográficos
  paises: any[] = [];
  departamentos: any[] = [];
  municipios: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private authService: AuthService // Inyectamos el servicio corregido
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.cargarPaises();

    this.route.data.subscribe(data => {
      if (data['role']) {
        this.isRoleFixed = true;
        this.registerRole = data['role'];
        this.registerForm.patchValue({ rol: data['role'] });
        this.updateLoginLink(data['role']);
      }
    });
  }

  initForm() {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      rol: ['Cliente', [Validators.required]],
      pais: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      codigoPais: ['+57'],
      telefono: [''],
      fechaNacimiento: ['']
    }, { validators: this.passwordMatchValidator });
  }

  // --- Lógica de Ayuda ---
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  updateLoginLink(role: string) {
    const links: { [key: string]: string } = {
      'Tendero': '/store/login',
      'Cliente': '/client/login',
      'Admin': '/admin/login'
    };
    this.loginLink = links[role] || '/login';
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }

  // --- Lógica de Geografía ---
  cargarPaises() {
    this.locationService.getPaises().subscribe((data: any[]) => {
      this.paises = data;
      const colombia = this.paises.find(p => p.nombre === 'Colombia');
      if (colombia) {
        this.registerForm.patchValue({ pais: colombia.nombre });
        this.onPaisChange({ target: { value: colombia.nombre } });
      }
    });
  }

  onPaisChange(event: any) {
    const nombrePais = event.target.value;
    const paisSeleccionado = this.paises.find(p => p.nombre === nombrePais);
    this.departamentos = [];
    this.municipios = [];
    this.registerForm.patchValue({ departamento: '', ciudad: '' });

    if (paisSeleccionado) {
      this.locationService.getDepartamentos(paisSeleccionado.id).subscribe((data: any[]) => {
        this.departamentos = data;
        if (paisSeleccionado.codigo) {
          this.registerForm.patchValue({ codigoPais: paisSeleccionado.codigo });
        }
      });
    }
  }

  onDepartamentoChange(event: any) {
    const nombreDepto = event.target.value;
    const deptoSeleccionado = this.departamentos.find(d => d.nombre === nombreDepto);
    this.municipios = [];
    this.registerForm.patchValue({ ciudad: '' });

    if (deptoSeleccionado) {
      this.locationService.getMunicipios(deptoSeleccionado.id).subscribe((data: any[]) => {
        this.municipios = data;
      });
    }
  }

  // --- REGISTRO FINAL ---
  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.value;
    const body = {
      nombre: formValue.nombre,
      email: formValue.email,
      password: formValue.password,
      rol: formValue.rol,
      pais: formValue.pais,
      ciudad: formValue.ciudad,
      telefono: `${formValue.codigoPais} ${formValue.telefono}`,
      fechaNacimiento: formValue.fechaNacimiento ? new Date(formValue.fechaNacimiento) : null
    };

    const isAdmin = formValue.rol === 'Admin';

    this.authService.register(body, isAdmin).subscribe({
      next: (res) => {
        console.log('Registro exitoso', res);
        this.router.navigate([this.loginLink]);
      },
      error: (err) => this.handleRegisterError(err)
    });
  }

  // --- MANEJO DE ERRORES CENTRALIZADO ---
  private handleRegisterError(err: any) {
    console.error('Error en registro:', err);
    this.errorType = 'error';

    if (err.status === 409) {
      this.errorMsg = '⚠️ Este correo electrónico ya está registrado.';
      this.errorType = 'warning';
    } else if (err.status === 400) {
      this.errorMsg = err.error?.message || 'Datos inválidos. Verifica los campos.';
    } else if (err.status >= 500) {
      this.errorMsg = '🔧 Error del sistema. Intenta más tarde.';
    } else {
      this.errorMsg = 'No se pudo completar el registro.';
    }
  }

  // Getters para el template
  get f() { return this.registerForm.controls; }
  get isTendero() { return this.registerForm.get('rol')?.value === 'Tendero'; }
}