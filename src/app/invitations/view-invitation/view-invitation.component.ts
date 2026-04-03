import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  private countdownInterval: any;

  // Datos de ejemplo TEMPORALES (posteriormente vendrían de firebase)
  private sampleInvitation: Invitation = {
    id: '1',
    hostId: 'user123',
    guestOfHonor: 'María González',
    eventType: EventType.BIRTHDAY,
    eventDate: new Date('2024-12-25T20:00:00'), // Fecha futura para probar countdown
    location: 'Salón Primavera',
    address: 'Av. Siempre Viva 123, CABA',
    phoneNumber: '+54 11 1234-5678',
    backgroundImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    animationStyle: AnimationStyle.CONFETTI,
    createdAt: new Date(),
    shareableLink: 'http://localhost:4200/invitation/1'
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // TEMPORAL: datos de ejemplo
    this.invitation = this.sampleInvitation;
    
    // Iniciar cuenta regresiva
    this.startCountdown();
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
  
  navigator.clipboard.writeText(this.invitation.shareableLink);
  alert('¡Link copiado al portapapeles! 🎉');
}
}