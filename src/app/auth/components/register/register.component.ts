import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
    }
  }

  passwordsMatch(): boolean {
    return this.registerForm.get('password')?.value === 
           this.registerForm.get('confirmPassword')?.value;
  }
}