import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,  
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  emailSent = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    if (this.forgotForm.valid) {
      this.loading = true;
      
      const result = await this.authService.forgotPassword(this.forgotForm.value.email);
      this.loading = false;

      if (result.success) {
        this.emailSent = true;
      } else {
        alert('Error: ' + result.error);
      }
    }
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}