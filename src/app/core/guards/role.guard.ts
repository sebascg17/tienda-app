import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['role'];
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      // El backend devuelve los roles en el claim "role" (puede ser un string o array)
      const roles = decoded.role || [];

      const userRoles = Array.isArray(roles) ? roles : [roles];

      if (userRoles.includes(expectedRole)) {
        return true;
      } else {
        // Rol incorrecto, redirigir al home o dashboard por defecto
        this.router.navigate(['/']);
        return false;
      }
    } catch (e) {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
