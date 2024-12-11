import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firebase.service';
import { Podcast } from '../../../shared/interfaces/podcast.interface';
import { MediaElement } from '../../interfaces/media-element.interface';
import { Project } from '../../../shared/interfaces/project.interface';
import { Timestamp } from '@angular/fire/firestore';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'radio-home-page',
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css',
    standalone: false
})
export class HomePageComponent implements OnInit{

  public podcasts: Podcast[] = [];
  public recentProjects: Project[] = [];
  public projects: Project[] = [];
  public projectPrueba: Project = {content:'',date:Timestamp.now(),keywords:'',photo_filename:'',photo_url:'',summary:'',title:'Prueba',likes:0,};

  date: string[] = [];

  public recentProject1: Project | null = null;
  public recentProject2: Project | null = null;
  public recentProject3: Project | null = null;

  public mediaElementCarousel:MediaElement[] = [
    {id: '01', title: 'En Radio UTPL, cada voz cuenta. ¡Sintoniza y sé parte de nuestra comunidad académica!', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/carousel_home%2F1%202.jpg?alt=media&token=82877c38-c84d-433e-950c-54e8edf68e42'},
    {id: '02', title: 'Desde el campus hasta tu hogar, Radio UTPL te conecta con la esencia de nuestra universidad', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/carousel_home%2F2.jpg?alt=media&token=9e697573-662f-40e5-92fe-1731b03a3bfd'},
    {id: '03', title: 'Aquí en Radio UTPL, celebramos el talento y las historias de nuestros estudiantes. ¡Tu voz es nuestra inspiración!', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/carousel_home%2F3.jpg?alt=media&token=04baf205-3ba5-4611-bc10-9084c5a1cee3'},
    {id: '04', title: 'Con cada programa, fortalecemos los lazos entre la universidad y la comunidad. ¡Gracias por ser parte de Radio UTPL!', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/carousel_home%2F4.jpg?alt=media&token=c64bf7b4-db7c-48b0-9602-f07bdd4bf8ac'},
    {id: '05', title: 'En Radio UTPL, la música y el conocimiento se entrelazan. ¡Súmate a nuestra programación y descubre lo que somos!', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/carousel_home%2F5.jpg?alt=media&token=72c6548b-dc6c-4d91-811b-b283996da987'},
    {id: '06', title: 'Tu comunidad académica, tu música, tu radio. ¡Bienvenidos a Radio UTPL!', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/carousel_home%2F6.png?alt=media&token=3dc5fd46-5bca-4806-89ae-43f28ff427f9'}
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(private firestore: FirestoreService){}

  public ngOnInit(): void {
    this.getPodcasts();
    this.getProjects();
  }

  public getPodcasts():void{
    this.firestore.getLatestDocuments<Podcast>('podcast','date',3).subscribe( podcast => {
      this.podcasts = podcast;
    });
  }

  public getProjects():void{
    this.firestore.getLatestDocuments<Project>('project','date',3)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(projects => {
      this.projects = projects;
      this.formatDateProjects(this.projects);
      console.log(this.projects);
    });
  }

  public formatDateProjects(projects:Project[]) {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    for (let i = 0; i < projects.length; i++) {
        const date = projects[i].date.toDate();
        const dia = date.getDate();
        const mes = meses[date.getMonth()];
        const anio = date.getFullYear();
        this.date[i] = `${dia} de ${mes} de ${anio}`;
    }
  }

  public getRecentProjects(): void {
    this.firestore.getOrderedArray<Project>('project','date',3).subscribe(res => {
      this.recentProjects = res;
      this.recentProject1 = res[0];
      this.recentProject2 = res[1];
      this.recentProject3 = res[2];
      console.log('Proyectos recientes:', this.recentProjects);
      this.formatDates();
    });
  }

  public formatDates() {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    for (let i = 0; i < 3; i++) {
      if (this.recentProjects[i]) {
        const date = this.recentProjects[i].date.toDate();
        const dia = date.getDate();
        const mes = meses[date.getMonth()];
        const anio = date.getFullYear();
        this.date[i] = `${dia} de ${mes} de ${anio}`;
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
