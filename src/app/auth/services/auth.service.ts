import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

// Firebase
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  UserCredential,
  onAuthStateChanged,
  User as FirebaseUser
} from '@angular/fire/auth';

// Interfaces
import { User } from '../interfaces/user-interface';
import { LoginRequest } from '../interfaces/login-request';
import { RegisterRequest } from '../interfaces/register-request';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    this.initializeAuthListener();
  }

  private initializeAuthListener(): void {
    onAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined
        };
        this.currentUserSubject.next(user);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  register(registerData: RegisterRequest): Observable<User> {
    return from(
      createUserWithEmailAndPassword(
        this.auth, 
        registerData.email, 
        registerData.password
      )
    ).pipe(
      map((userCredential: UserCredential) => {
        const user: User = {
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          displayName: registerData.displayName
        };
        return user;
      }),
      tap(() => {
        this.router.navigate(['/dashboard']);
      }),
      catchError(error => {
        console.error('Error en registro:', error);
        throw error;
      })
    );
  }

  login(loginData: LoginRequest): Observable<User> {
    return from(
      signInWithEmailAndPassword(
        this.auth, 
        loginData.email, 
        loginData.password
      )
    ).pipe(
      map((userCredential: UserCredential) => {
        const user: User = {
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          displayName: userCredential.user.displayName || undefined
        };
        return user;
      }),
      tap(() => {
        this.router.navigate(['/dashboard']);
      }),
      catchError(error => {
        console.error('Error en login:', error);
        throw error;
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Error en logout:', error);
        throw error;
      })
    );
  }

  forgotPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      catchError(error => {
        console.error('Error enviando email de reset:', error);
        throw error;
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}