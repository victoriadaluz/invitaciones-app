import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InvitationService } from '../../auth/services/invitation.service';

// Interfaces
import { Invitation, EventType, AnimationStyle } from '../interfaces/invitation.interface';

@Component({
  selector: 'app-view-invitation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-invitation.component.html',
  styleUrls: ['./view-invitation.component.scss']
})
export class ViewInvitationComponent implements OnInit, OnDestroy {
  invitation: Invitation | null = null;
  daysRemaining: number = 0;
  hoursRemaining: number = 0;
  minutesRemaining: number = 0;
  loadError: string | null = null;
  private countdownInterval: any;

  constructor(
    private route: ActivatedRoute,
    private invitationService: InvitationService,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ViewInvitationComponent: route id', id);
    if (!id) {
      this.loadError = 'ID de invitación no encontrado en la ruta.';
      console.error(this.loadError);
      return;
    }

    try {
      this.invitation = await this.invitationService.getInvitationById(id);
      if (this.invitation) {
        console.log('ViewInvitationComponent: invitación encontrada', this.invitation);
        this.startCountdown();
      } else {
        this.loadError = 'Invitación no encontrada.';
        console.error(this.loadError);
      }
    } catch (err) {
      this.loadError = 'Error al cargar la invitación. Revisa la consola.';
      console.error('ViewInvitationComponent: error al obtener invitación', err);
    }
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown() {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private updateCountdown() {
    if (!this.invitation) return;

    const now = new Date().getTime();
    const eventTime = new Date(this.invitation.eventDate).getTime();
    const timeRemaining = eventTime - now;

    if (timeRemaining <= 0) {
      this.daysRemaining = 0;
      this.hoursRemaining = 0;
      this.minutesRemaining = 0;
      clearInterval(this.countdownInterval);
      return;
    }

    this.daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    this.hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  }

  getEventTypeText(): string {
  if (!this.invitation) return 'evento especial';
  
  const eventTexts = {
    [EventType.BIRTHDAY]: 'cumpleaños',
    [EventType.WEDDING]: 'casamiento',
    [EventType.BABY_SHOWER]: 'baby shower',
    [EventType.GRADUATION]: 'graduación',
    [EventType.ANNIVERSARY]: 'aniversario',
    [EventType.OTHER]: 'evento especial'
  };
  
  return eventTexts[this.invitation.eventType] || 'evento especial';
}

formatEventDate(): string {
  if (!this.invitation) return 'Fecha no especificada';
  
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(this.invitation.eventDate).toLocaleDateString('es-ES', options);
}

formatEventTime(): string {
  if (!this.invitation) return 'Horario no especificado';
  
  // TEMPORAL: Simular horas de inicio y fin
  const startTime = '20:00';
  const endTime = '02:00';
  return `${startTime} a ${endTime} hs`;
}

shareInvitation() {
  if (!this.invitation) return;
  const link = this.invitation.shareableLink || window.location.href;
  navigator.clipboard.writeText(link);
  alert('¡Link copiado al portapapeles! 🎉');
}
}