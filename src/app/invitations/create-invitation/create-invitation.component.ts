
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationService } from '../../auth/services/invitation.service';
import { AuthService } from '../../auth/services/auth.service';
import { EventType, AnimationStyle } from '../interfaces/invitation.interface';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-invitation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-invitation.component.html',
  styleUrls: ['./create-invitation.component.scss']
})
export class CreateInvitationComponent {
  invitationForm: FormGroup;
  loading = false;
  selectedFile: File | null = null;
  eventTypes = [
    { value: EventType.BIRTHDAY, label: 'Cumpleaños' },
    { value: EventType.WEDDING, label: 'Boda' },
    { value: EventType.BABY_SHOWER, label: 'Baby Shower' },
    { value: EventType.GRADUATION, label: 'Graduación' },
    { value: EventType.ANNIVERSARY, label: 'Aniversario' },
    { value: EventType.OTHER, label: 'Otro' },
  ];

  timeSlots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).slice(8, 24);

  animationStyles = [
    { value: AnimationStyle.BALLOONS, label: 'Globos' },
    { value: AnimationStyle.CONFETTI, label: 'Confetti' },
    { value: AnimationStyle.SPARKLES, label: 'Chispas' },
    { value: AnimationStyle.NONE, label: 'Sin animación' },
  ];

  constructor(
    private fb: FormBuilder,
    private invitationService: InvitationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.invitationForm = this.fb.group({
      guestOfHonor: ['', Validators.required],
      eventType: ['birthday', Validators.required],
      eventDate: ['', Validators.required],
      startTime: ['19:00', Validators.required],
      endTime: ['23:00', Validators.required],
      location: [''],
      address: [''],
      phoneNumber: [''],
      animationStyle: ['balloons'],
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async onSubmit() {
    if (this.invitationForm.invalid) return;
    this.loading = true;

    try {
      // 1. Crear invitación sin imagen
      const invitationId = await this.invitationService.createInvitation(this.invitationForm.value);

      // 2. Si hay imagen, subirla y actualizar URL
      if (this.selectedFile) {
        const imageUrl = await this.invitationService.uploadImage(this.selectedFile, invitationId);
        await this.invitationService.updateImageUrl(invitationId, imageUrl);
      }

      // 3. Redirigir a la vista de la invitación
      this.router.navigate(['/invitation', invitationId]);
    } catch (error) {
      console.error(error);
      alert('Error al crear la invitación');
    } finally {
      this.loading = false;
    }
  }

  validateTimeRange(): boolean {
    const start = this.invitationForm.get('startTime')?.value;
    const end = this.invitationForm.get('endTime')?.value;
    if (!start || !end) return true;
    const toMinutes = (t: string) => {
      const [hh, mm] = t.split(':').map(Number);
      return hh * 60 + (mm || 0);
    };
    return toMinutes(end) > toMinutes(start);
  }

  get guestOfHonor(): AbstractControl | null { return this.invitationForm.get('guestOfHonor'); }
  get eventDate(): AbstractControl | null { return this.invitationForm.get('eventDate'); }
  get endTime(): AbstractControl | null { return this.invitationForm.get('endTime'); }
}