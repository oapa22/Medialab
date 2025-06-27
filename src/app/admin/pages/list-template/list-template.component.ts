import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../shared/interfaces/user.interface';
import { Podcast } from '../../../shared/interfaces/podcast.interface';
import { Project } from '../../../shared/interfaces/project.interface';
import { Message } from '../../../shared/interfaces/message.interface';
import { Reservation } from '../../../shared/interfaces/reservation.intertafe';
import { FirestoreService } from '../../../medialab/services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'admin-list-template',
    templateUrl: './list-template.component.html',
    styleUrl: './list-template.component.css',
    standalone: false
})
export class ListTemplateComponent implements OnInit{
  public podcasts: Podcast[] = [];
  public projects: Project[] = [];
  public messages: Message[] = [];
  public users: User[] = [];
  public reservations: Reservation[] = []; // Nuevo
  public param: string = '';
  public valueLabel: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private fireStoreService: FirestoreService
  ){}

  ngOnInit(): void {
      if (this.router.url.includes('lista-podcasts')) {
        // this.fireStoreService.getCollection<Podcast>('podcast').subscribe(res => {
        //   this.podcasts = res;
        // });
        this.valueLabel = 'podcast';
      } else if (this.router.url.includes('lista-noticias')) {
        // this.fireStoreService.getCollection<Project>('project').subscribe(res => {
        //   this.projects = res;
        // });
        this.valueLabel = 'noticia';
      } else if (this.router.url.includes('lista-mensajes')) {
        // this.fireStoreService.getCollection<Message>('message').subscribe(res => {
        //   this.messages = res;
        // });
        this.valueLabel = 'mensaje';
      } else if(this.router.url.includes('lista-usuarios')){
        // this.fireStoreService.getCollection<User>('user').subscribe(res => {
        //   this.users = res;
        // });
        this.valueLabel = 'usuario';
      } else if (this.router.url.includes('lista-reservaciones')) {
        this.valueLabel = 'reservacion';
        this.loadPendingReservations(); // Cargar reservaciones pendientes
      } else {
        this.router.navigate(['admin/']);

      }

  }

  public navigateToSection(): void {
    const valueLink = 'admin/nuevo-' + this.valueLabel;
    if (this.valueLabel) {
      console.log(valueLink);
      this.router.navigate([valueLink]);
    }
  }

  public getPodcasts(podcasts:Podcast[]):void{
    this.podcasts = podcasts;
  }

  public getProjects(projects:Project[]):void{
    this.projects = projects;
  }

  public getMessages(messages:Message[]):void{
    this.messages = messages;
  }

  public getUsers(users:User[]):void{
    this.users = users;
  }

  public getReservations(reservations: Reservation[]): void {
    this.reservations = reservations;
  }

  loadPendingReservations(): void {
    this.subscription.add(
      this.fireStoreService
        .getFilteredCollection<Reservation>('reservations', 'status', 'Pendiente')
        .subscribe((res) => {
          this.reservations = res;
        })
    );
  }

  public formatDate(timestamp: any): string {
    if (timestamp?.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
    }
    return '';
  }

}
