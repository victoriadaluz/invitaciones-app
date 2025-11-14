export interface Invitation {
  id?: string;
  hostId: string;           // ID del usuario creador
  guestOfHonor: string;     // Nombre del agasajado
  eventType: EventType;     // Tipo de evento
  eventDate: Date;          // Fecha y hora
  location?: string;        // Ubicación/salón
  address?: string;         // Dirección para el mapa
  phoneNumber?: string;     // Teléfono para confirmaciones
  backgroundImage?: string; // URL de la imagen subida
  animationStyle: AnimationStyle; // Estilo de animación
  createdAt: Date;
  shareableLink: string;    // Link único para compartir
}

export enum EventType {
  BIRTHDAY = 'birthday',
  WEDDING = 'wedding',
  BABY_SHOWER = 'baby_shower',
  GRADUATION = 'graduation',
  ANNIVERSARY = 'anniversary',
  OTHER = 'other'
}

export enum AnimationStyle {
  BALLOONS = 'balloons',
  CONFETTI = 'confetti',
  SPARKLES = 'sparkles',
  NONE = 'none'
}