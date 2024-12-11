import { Timestamp } from '@angular/fire/firestore';

export interface User {
  uid: string;
  id?: string;
  names: string;
  email: string;
  password: string;
  isAdmin: boolean;
  likedProjects?: string[];
  date: Timestamp;
}
