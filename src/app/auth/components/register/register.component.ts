import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.registerForm.valid && this.passwordsMatch()) {
      this.loading = true;
      
      const formValue = this.registerForm.value;
      const result = await this.authService.register(
        formValue.email, 
        formValue.password, 
        formValue.displayName
      );

      this.loading = false;

      if (!result.success) {
        alert('Error: ' + result.error);
      }
      // Si es success, el authService ya redirige a /dashboard
    }
  }

  passwordsMatch(): boolean {
    const password = this.registerForm?.get('password')?.value;
    const confirmPassword = this.registerForm?.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  // Getters para acceder fácilmente a los controles
  get displayName() { return this.registerForm.get('displayName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}