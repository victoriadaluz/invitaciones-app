import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  constructor() {
    // Escuchar cambios de autenticación
    onAuthStateChanged(this.auth, (user) => {
      console.log('Usuario auth state changed:', user?.email);
    });
  }

  // Registro simple
  async register(email: string, password: string, displayName: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('Registro exitoso:', result.user.email);
      this.router.navigate(['/dashboard']);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Error en registro:', error);
      return { success: false, error: error.message };
    }
  }

  // Login simple  
  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login exitoso:', result.user.email);
      this.router.navigate(['/dashboard']);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    }
  }

  // Logout simple
  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
      return { success: true };
    } catch (error: any) {
      console.error('Error en logout:', error);
      return { success: false, error: error.message };
    }
  }

  // Reset password
  async forgotPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Error en forgot password:', error);
      return { success: false, error: error.message };
    }
  }

  // Usuario actual
  getCurrentUser() {
    return this.auth.currentUser;
  }
}