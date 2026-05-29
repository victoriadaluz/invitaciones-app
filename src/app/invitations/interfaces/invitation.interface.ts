export interface Invitation {
  id?: string; // ID único de Firestore
  hostId: string; // UID del usuario creador
  guestOfHonor: string;
  eventType: EventType;
  eventDate: Date;
  startTime: string;
  endTime: string;
  location?: string;
  address?: string;
  phoneNumber?: string;
  backgroundImageUrl: string; // URL de Firebase
  animationStyle: AnimationStyle;
  createdAt: Date;
  shareableLink?: string;
}

export enum EventType {
  BIRTHDAY = 'birthday',
  WEDDING = 'wedding',
  BABY_SHOWER = 'baby_shower',
  GRADUATION = 'graduation',
  ANNIVERSARY = 'anniversary',
  OTHER = 'other',
}

export enum AnimationStyle {
  BALLOONS = 'balloons',
  CONFETTI = 'confetti',
  SPARKLES = 'sparkles',
  NONE = 'none',
}
