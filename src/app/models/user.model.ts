/**
 * Modelos internos de la aplicación (Domain Models)
 * Representan la estructura de datos dentro de la app
 * Diferenciado de DTOs que son para transferencia de datos
 */

import { UsuarioReadDto } from '../dtos/usuarios/usuario.dto';

/**
 * Interfaz User - Representación interna del usuario
 * Usada en componentes, servicios y state management
 */
export interface User {
  id?: string;
  nombre: string;
  apellido?: string;
  email: string;
  photoUrl: string | null;
  roles: string[];
  fechaNacimiento?: Date;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  barrio?: string;
  isAuthenticated: boolean;
}

/**
 * Helper function para construir User desde JWT payload
 * @param payload - Claims decodificados del JWT
 * @returns User object
 */
export function buildUserFromTokenPayload(payload: any): User {
  return {
    id: payload.id || payload.sub || '',
    nombre: payload.nombre || payload.unique_name || '',
    apellido: payload.apellido || '',
    email: payload.email || '',
    photoUrl: formatPhotoUrl(payload.profilePhotoUrl || payload.photoUrl),
    roles: payload.roles ?
      (Array.isArray(payload.roles) ? payload.roles : [payload.roles])
      : [],
    fechaNacimiento: payload.fechaNacimiento ? new Date(payload.fechaNacimiento) : undefined,
    telefono: payload.telefono,
    direccion: payload.direccion,
    ciudad: payload.ciudad,
    departamento: payload.departamento,
    pais: payload.pais,
    barrio: payload.barrio,
    isAuthenticated: true
  };
}

const BASE_URL = 'http://localhost:5237';

export function formatPhotoUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Helper function para convertir DTO a Model
 * @param dto - UsuarioReadDto del servidor
 * @returns User model para usar en la app
 */
export function buildUserFromDto(dto: UsuarioReadDto): User {
  return {
    id: dto.id.toString(),
    nombre: dto.nombre,
    apellido: dto.apellido,
    email: dto.email,
    photoUrl: formatPhotoUrl(dto.photoUrl),
    roles: dto.roles,
    fechaNacimiento: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : undefined,
    telefono: dto.telefono,
    direccion: dto.direccion,
    ciudad: dto.ciudad,
    departamento: dto.departamento,
    pais: dto.pais,
    barrio: dto.barrio,
    isAuthenticated: true
  };
}
