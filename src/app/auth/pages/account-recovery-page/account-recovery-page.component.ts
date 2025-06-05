import { AuthServiceService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from './../../../medialab/services/firebase.service';
import { User } from '../../../shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';

@Component({
    selector: 'app-account-recovery-page',
    templateUrl: './account-recovery-page.component.html',
    styleUrl: './account-recovery-page.component.css',
    standalone: false
})
export class AccountRecoveryPageComponent {
  users: User[] = [];
  user: User = {
    uid: '',
    id: '',
    names: '',
    email: '',
    password: '',
    isAdmin: false,
    date: Timestamp.now()
  }

  constructor(
    private firestore: FirestoreService,
    private auth: AuthServiceService,
    private router: Router){
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.firestore.getCollection<User>('user').subscribe( res => {
      this.users = res;
    });
  }

  recoverPassword(){
    this.auth.recoverPassword(this.user.email);
  }
}
