import {
  EnvironmentInjector,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private router: Router,
    private environmentInjector: EnvironmentInjector,
  ) {
    // Escuchar cambios de autenticación
    this.runInFirebaseContext(() =>
      onAuthStateChanged(this.auth, (user) => {
        console.log('Usuario auth state changed:', user?.email);
      }),
    );
  }

  // Registro simple
  async register(email: string, password: string, displayName: string) {
    try {
      const result = await this.runInFirebaseContext(() =>
        createUserWithEmailAndPassword(this.auth, email, password),
      );
      await this.runInFirebaseContext(() =>
        updateProfile(result.user, { displayName }),
      );
      console.log('Registro exitoso:', result.user.email);
      this.router.navigate(['/create-invitation']);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Error en registro:', error);
      return { success: false, error: this.getAuthErrorMessage(error) };
    }
  }

async login(email: string, password: string) {
  try {
    const result = await this.runInFirebaseContext(() =>
      signInWithEmailAndPassword(this.auth, email, password),
    );
    console.log('Login exitoso:', result.user.email);
     this.router.navigate(['/create-invitation']);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('Error de login:', error);
    return { success: false, error: this.getAuthErrorMessage(error) };
  }
}

  // Logout
  async logout() {
    try {
      await this.runInFirebaseContext(() => signOut(this.auth));
      this.router.navigate(['/login']);
      return { success: true };
    } catch (error: any) {
      console.error('Error en logout:', error);
      return { success: false, error: this.getAuthErrorMessage(error) };
    }
  }

  // Resetear contraseña
  async forgotPassword(email: string) {
    try {
      await this.runInFirebaseContext(() =>
        sendPasswordResetEmail(this.auth, email),
      );
      return { success: true };
    } catch (error: any) {
      console.error('Error en forgot password:', error);
      return { success: false, error: this.getAuthErrorMessage(error) };
    }
  }

  // Usuario actual
  getCurrentUser() {
    return this.auth.currentUser;
  }

  private runInFirebaseContext<T>(operation: () => T): T {
    return runInInjectionContext(this.environmentInjector, operation);
  }

  private getAuthErrorMessage(error: any): string {
    switch (error?.code) {
      case 'auth/email-already-in-use':
        return 'Ese email ya está registrado. Probá iniciar sesión.';
      case 'auth/invalid-email':
        return 'El email no tiene un formato válido.';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil. Usá al menos 6 caracteres.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email o contraseña incorrectos.';
      case 'auth/network-request-failed':
        return 'Firebase Auth rechazó o no pudo completar la conexión. Revisá que Email/Password esté habilitado, que el dominio local esté autorizado y que la API key permita Identity Toolkit.';
      case 'auth/unauthorized-domain':
        return 'Este dominio no está autorizado en Firebase Authentication.';
      case 'auth/operation-not-allowed':
        return 'El proveedor Email/Password no está habilitado en Firebase Authentication.';
      default:
        return error?.message || 'No se pudo completar la autenticación.';
    }
  }
}
