import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-invitation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-invitation.component.html',
  styleUrls: ['./create-invitation.component.scss']
})
export class CreateInvitationComponent {
  invitationForm: FormGroup;
  eventTypes = [
    { value: 'birthday', label: '🎂 Cumpleaños' },
    { value: 'wedding', label: '💍 Casamiento' },
    { value: 'baby_shower', label: '👶 Baby Shower' },
    { value: 'graduation', label: '🎓 Graduación' },
    { value: 'anniversary', label: '💑 Aniversario' },
    { value: 'other', label: '🎉 Otro evento' }
  ];
  
  animationStyles = [
    { value: 'balloons', label: '🎈 Globos' },
    { value: 'confetti', label: '🎊 Confetti' },
    { value: 'sparkles', label: '✨ Brillitos' },
    { value: 'none', label: 'Sin animación' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.invitationForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      guestOfHonor: ['', [Validators.required, Validators.minLength(2)]],
      eventType: ['birthday', [Validators.required]],
      eventDate: ['', [Validators.required]],
      eventTime: ['19:00', [Validators.required]],
      location: [''],
      address: [''],
      phoneNumber: [''],
      backgroundImage: [null],
      animationStyle: ['balloons']
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Procesamiento de imagen
      console.log('Imagen seleccionada:', file.name);
      this.invitationForm.patchValue({ backgroundImage: file });
    }
  }

  onSubmit() {
    if (this.invitationForm.valid) {
      // Aquí guardaremos la invitación en Firebase después
      console.log('Invitación creada:', this.invitationForm.value);
      
      // TEMPORAL: Redirige a vista de invitación
      this.router.navigate(['/invitation/preview']);
    }
  }

  // Getters para los controles
  get guestOfHonor() { return this.invitationForm.get('guestOfHonor'); }
  get eventType() { return this.invitationForm.get('eventType'); }
  get eventDate() { return this.invitationForm.get('eventDate'); }
}