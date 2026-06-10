
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
  selectedFileName: string = '';
  imagePreview: string | null = null;
  errorMessage: string = '';
  successMessage: string = '';
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
    if (this.selectedFile) {
      this.selectedFileName = this.selectedFile.name;
      // Generar preview de imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async onSubmit() {
    if (this.loading) {
      return;
    }

    if (this.invitationForm.invalid) {
      this.invitationForm.markAllAsTouched();
      this.errorMessage = '❌ Por favor completa todos los campos requeridos';
      return;
    }
    if (!this.validateTimeRange()) {
      this.errorMessage = '❌ La hora de fin debe ser después de la de inicio';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      console.log('Creando invitación...');
      // 1. Crear invitación sin imagen
      const invitationId = await this.invitationService.createInvitation(this.invitationForm.value);
      console.log('Invitación creada con ID:', invitationId);

      // 2. Si hay imagen, intentar subirla y actualizar URL pero NO bloquear la navegación si falla
      if (this.selectedFile) {
        try {
          console.log('Subiendo imagen:', this.selectedFileName);
          const imageUrl = await this.invitationService.uploadImage(this.selectedFile, invitationId);
          console.log('Imagen subida:', imageUrl);
          await this.invitationService.updateImageUrl(invitationId, imageUrl);
          console.log('URL de imagen actualizada');
        } catch (imgErr) {
          console.error('Error subiendo imagen (no bloqueante):', imgErr);
          // Mostrar advertencia pero continuar
          this.errorMessage = '⚠️ La invitación se creó pero falló la subida de la imagen.';
        }
      }

      this.successMessage = '✅ ¡Invitación creada exitosamente!';
      console.log('Intentando redirigir a /invitation/', invitationId);
      // 3. Redirigir a la vista de la invitación (intento inmediato)
      try {
        const navigationResult = await this.router.navigate(['/invitation', invitationId]);
        console.log('Navegación resultado:', navigationResult);
        if (!navigationResult) {
          console.warn('La navegación fue rechazada o no se realizó. Intentando de nuevo.');
          setTimeout(() => this.router.navigate(['/invitation', invitationId]), 500);
        } else {
          console.log('Navegación realizada');
        }
      } catch (navErr) {
        console.error('Error en navegación:', navErr);
        // Como fallback, intentar de nuevo después de breve espera
        setTimeout(() => this.router.navigate(['/invitation', invitationId]), 500);
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      this.errorMessage = `❌ Error: ${error?.message || 'Algo salió mal'}`;
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
