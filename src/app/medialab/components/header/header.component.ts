import { Component, Input, OnInit } from '@angular/core';
import { BrowserRoute } from '../../interfaces/browser-route';
import { FirestoreService } from '../../services/firebase.service';
import { AuthServiceService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../shared/interfaces/user.interface';
import { Timestamp } from '@angular/fire/firestore';

@Component({
    selector: 'medialab-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: false
})
export class HeaderComponent implements OnInit{
  docId!: string;
  logged = false;
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

  showDropdown: string | null = null;
  closeTimeout: any;


  constructor(
    private firestore:FirestoreService,
        private router:Router,
    private auth: AuthServiceService,
  ){}

  ngOnInit(): void {
    this.auth.stateUser().subscribe(res => {
      if (res) {
        this.docId = res.uid;
        this.logged = true;
        console.log(res.uid,'esta logueado')
        this.getUser()
      } else {
        console.log('no esta loguead')
      }
    });
  }

    toggleDropdown(title: string, show: boolean) {
    if (show) {
      this.showDropdown = title;
      clearTimeout(this.closeTimeout);
    } else {
      this.closeTimeout = setTimeout(() => {
        if (this.showDropdown === title) {
          this.showDropdown = null;
        }
      }, 300); // Espera antes de cerrar
    }
  }

  keepDropdownOpen() {
    clearTimeout(this.closeTimeout);
  }

  closeDropdownAfterNavigation() {
    setTimeout(() => {
      this.showDropdown = null;
    }, 500); 
  }
  
  getUser(){
    const path = 'user'
    console.log(this.docId,'docid')
    this.firestore.getDocProject<User>(path, this.docId).subscribe( res => {
      this.user = {
        uid: res!.uid,
        id: res!.id,
        names: res!.names,
        email: res!.email,
        password: '',
        isAdmin: res!.isAdmin,
        date: res!.date,
      };
      console.log(this.user.email)
    });
  }

  async logout(){
    await this.auth.logout();
    await this.router.navigate(['inicio']);
    window.location.reload();
  }

  @Input()
  public currentRoute:string = '';

  @Input() public browserRoutes:BrowserRoute[] = [];

}