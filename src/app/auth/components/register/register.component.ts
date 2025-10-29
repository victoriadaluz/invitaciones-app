import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';


//Todos los componentes deberían tener el standalone y estos imports
@Component({
  selector: 'app-register',
  standalone: true,  
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

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

  onSubmit() {
    if (this.registerForm.valid && this.passwordsMatch()) {
      const { confirmPassword, ...registerData } = this.registerForm.value;
      this.authService.register(registerData).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (error) => console.error('Register error:', error)
      });
    }
  }

  passwordsMatch(): boolean {
    return this.registerForm.get('password')?.value === 
           this.registerForm.get('confirmPassword')?.value;
  }
}