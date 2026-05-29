
import { InvitationService } from '../../auth/services/invitation.service';
import { AuthService } from '../../auth/services/auth.service';
import { EventType, AnimationStyle } from '../interfaces/invitation.interface';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

export class CreateInvitationComponent {
  invitationForm: FormGroup;
  loading = false;
  selectedFile: File | null = null;

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
}