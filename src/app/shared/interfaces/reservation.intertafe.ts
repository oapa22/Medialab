import { Timestamp } from '@angular/fire/firestore';

export interface Reservation {
  id?: string;
  title: string;
  eventType: string;
  room: string;
  start: Timestamp;
  end: Timestamp;
  // createdAt: Timestamp;
  participants: number;
  observations: string;
  status: string;
  userId: string;
}
