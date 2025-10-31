import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): boolean {
    if (!this.auth.currentUser) {
      return true;
    }
    this.router.navigate(['/dashboard']);
    return false;
  }
}