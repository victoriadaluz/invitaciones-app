import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-invitation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-invitation.component.html',
  styleUrls: ['./create-invitation.component.scss'],
})
export class CreateInvitationComponent {
  invitationForm: FormGroup;
  eventTypes = [
    { value: 'birthday', label: '🎂 Cumpleaños' },
    { value: 'wedding', label: '💍 Casamiento' },
    { value: 'baby_shower', label: '👶 Baby Shower' },
    { value: 'graduation', label: '🎓 Graduación' },
    { value: 'anniversary', label: '💑 Aniversario' },
    { value: 'other', label: '🎉 Otro evento' },
  ];

  animationStyles = [
    { value: 'balloons', label: '🎈 Globos' },
    { value: 'confetti', label: '🎊 Confetti' },
    { value: 'sparkles', label: '✨ Brillitos' },
    { value: 'none', label: 'Sin animación' },
  ];

  // Horas disponibles cada 15 minutos
  timeSlots = this.generateTimeSlots();

  constructor(private fb: FormBuilder, private router: Router) {
    this.invitationForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      guestOfHonor: ['', [Validators.required, Validators.minLength(2)]],
      eventType: ['birthday', [Validators.required]],
      eventDate: ['', [Validators.required]],
      startTime: ['19:00', [Validators.required]], // ← Cambiado
      endTime: ['23:00', [Validators.required]],
      location: [''],
      address: [''],
      phoneNumber: [''],
      backgroundImage: [null],
      animationStyle: ['balloons'],
    });
  }

  // Generar horarios cada 15 minutos
  private generateTimeSlots(): string[] {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Imagen seleccionada:', file.name);
      this.invitationForm.patchValue({ backgroundImage: file });
    }
  }

  onSubmit() {
    if (this.invitationForm.valid) {
      console.log('Invitación creada:', this.invitationForm.value);
      this.router.navigate(['/invitation/preview']);
    }
  }

  // Validar que la hora de fin sea después de la de inicio
  validateTimeRange(): boolean {
    const startTime = this.invitationForm.get('startTime')?.value;
    const endTime = this.invitationForm.get('endTime')?.value;
    return startTime && endTime && startTime < endTime;
  }

  // Getters para los controles
  get guestOfHonor() {
    return this.invitationForm.get('guestOfHonor');
  }
  get eventType() {
    return this.invitationForm.get('eventType');
  }
  get eventDate() {
    return this.invitationForm.get('eventDate');
  }
  get startTime() {
    return this.invitationForm.get('startTime');
  }
  get endTime() {
    return this.invitationForm.get('endTime');
  }
}
