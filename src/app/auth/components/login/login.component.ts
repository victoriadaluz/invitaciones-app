import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      
      const result = await this.authService.login(
        this.loginForm.value.email, 
        this.loginForm.value.password
      );
      
      this.loading = false;

      if (!result.success) {
        alert('Error: ' + result.error);
      }
      // Si es success, el authService ya redirige a /dashboard
    }
  }

  // Getters para acceder fácilmente a los controles
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}