import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // 1. Obtener el token (JWT propio de tu API)
    const token = localStorage.getItem('jwt_token');

    // 2. Simplificación: Solo verificamos la existencia. 
    // En una aplicación real, deberías también verificar si el token ha expirado.
    if (token) {
      // Token existe: el usuario está autenticado.
      return true;
    }

    // 3. Token no existe: redirigir a la página de login
    console.log('Acceso denegado: Token no encontrado.');
    return this.router.createUrlTree(['/login']);
  }
}