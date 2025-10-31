import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): boolean {
    // Si hay usuario autenticado, permite acceso
    if (this.auth.currentUser) {
      return true;
    }
    
    // Si NO está autenticado, redirige al login
    this.router.navigate(['/login']);
    return false;
  }
}