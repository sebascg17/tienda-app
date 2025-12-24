/**
 * Data Transfer Objects (DTOs) para Usuario
 * Usados para la comunicación entre frontend y backend
 */

/**
 * DTO de Lectura - Respuesta del servidor al obtener usuario
 * Usado en: GET /api/usuarios/{id}, GET /api/usuarios/me
 */
export interface UsuarioReadDto {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  photoUrl?: string;
  roles: string[];
  fechaCreacion: Date;
  fechaNacimiento?: Date;
}

/**
 * DTO de Actualización - Datos que puede cambiar el usuario
 * Usado en: PUT /api/usuarios/{id}
 */
export interface UsuarioUpdateDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  fechaNacimiento?: Date;
  fotoPerfilUrl?: string;
  pais?: string;
  ciudad?: string;
  direccion?: string;
  telefono?: string;
}

/**
 * DTO de Creación - Datos necesarios para registrar nuevo usuario
 * Usado en: POST /api/usuarios, POST /api/auth/register
 */
export interface UsuarioCreateDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  pais?: string;
  ciudad?: string;
  direccion?: string;
  telefono?: string;
  fechaNacimiento?: Date;
  rol?: string;
}

/**
 * DTO de Registro de Tienda - Datos específicos para registrar un tendero
 * Usado en: POST /api/auth/register-store
 */
export interface UsuarioRegisterStoreDto {
  nombreUsuario: string;
  apellido: string;
  email: string;
  password: string;
  nombreTienda: string;
  direccionTienda: string;
  telefonoTienda: string;
  pais: string;
  ciudad: string;
}

/**
 * DTO de Login - Credenciales para autenticación
 * Usado en: POST /api/auth/login
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * DTO de Respuesta de Login
 * Retorna el backend después de autenticar
 */
export interface LoginResponseDto {
  token: string;
  usuario: UsuarioReadDto;
  roles: string[];
}
