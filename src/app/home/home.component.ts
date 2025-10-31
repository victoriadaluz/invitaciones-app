import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  features = [
    {
      icon: '🎉',
      title: 'Invitaciones Únicas',
      description: 'Crea invitaciones personalizadas para tus eventos'
    },
    {
      icon: '📱',
      title: 'Compartí Fácil',
      description: 'Enviá por WhatsApp, email o redes sociales'
    },
    {
      icon: '✅',
      title: 'Confirmaciones',
      description: 'Seguí quiénes confirmaron asistencia'
    }
  ];
}