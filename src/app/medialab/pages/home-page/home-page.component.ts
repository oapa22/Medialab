import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firebase.service';
import { Podcast } from '../../../shared/interfaces/podcast.interface';
import { MediaElement } from '../../interfaces/media-element.interface';
import { Project } from '../../../shared/interfaces/project.interface';
import { Timestamp } from '@angular/fire/firestore';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'medialab-home-page',
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css',
    standalone: false
})
export class HomePageComponent implements OnInit{

  public podcasts: Podcast[] = [];
  public recentProjects: Project[] = [];
  public projects: Project[] = [];
  public projectPrueba: Project = {content:'',date:Timestamp.now(),keywords:'',photo_filename:'',photo_url:'',summary:'',title:'Prueba',likes:0,};
  templateProject: Project = {
    id: '1234',
    title: 'Aún no hay más noticias',
    date: Timestamp.now(),
    keywords: 'template',
    summary: 'Aquí se presentarán las nuevas noticias.',
    photo_url: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/media%2Ff2e5f5df-e778-45b9-a052-89e5d1a88934.jpg?alt=media&token=c9fc1092-3a06-4499-aa3c-781664c0bfc3',
    photo_filename: 'f2e5f5df-e778-45b9-a052-89e5d1a88934.jpg',
    content: 'content',
    likes: 0,
  }
  templateProject2: Project = {
    id: '1234',
    title: 'Aún no hay más noticias',
    date: Timestamp.now(),
    keywords: 'template',
    summary: 'Aquí se presentarán las nuevas noticias.',
    photo_url: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/media%2Ff2e5f5df-e778-45b9-a052-89e5d1a88934.jpg?alt=media&token=c9fc1092-3a06-4499-aa3c-781664c0bfc3',
    photo_filename: 'f2e5f5df-e778-45b9-a052-89e5d1a88934.jpg',
    content: 'content',
    likes: 0,
  }
  date: string[] = [];

  public recentProject1: Project | null = null;
  public recentProject2: Project | null = null;
  public recentProject3: Project | null = null;

  public mediaElementCarousel:MediaElement[] = [
    {id: '01', title: 'En Radio UTPL, cada voz cuenta. ¡Sintoniza y sé parte de nuestra comunidad académica!', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/carousel_home%2F1.webp?alt=media&token=aa054f9e-947a-42e5-b134-04a404bafc18'},
    {id: '02', title: 'Desde el campus hasta tu hogar, Radio UTPL te conecta con la esencia de nuestra universidad', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/carousel_home%2F2.webp?alt=media&token=e2bc0130-e4fc-4f98-9978-64ed7885826c'},
    {id: '03', title: 'Aquí en Radio UTPL, celebramos el talento y las historias de nuestros estudiantes. ¡Tu voz es nuestra inspiración!', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/carousel_home%2F3.webp?alt=media&token=bc29434f-2fc8-452c-a0a0-426124088a55'},
    {id: '04', title: 'Con cada programa, fortalecemos los lazos entre la universidad y la comunidad. ¡Gracias por ser parte de Radio UTPL!', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/carousel_home%2F4.webp?alt=media&token=6c42bfd7-e6a6-4378-a317-5249d492adbd'},
    {id: '05', title: 'En Radio UTPL, la música y el conocimiento se entrelazan. ¡Súmate a nuestra programación y descubre lo que somos!', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/carousel_home%2F5.webp?alt=media&token=204e32e4-e17b-438c-ba6c-31d3cc5c2604'},
    {id: '06', title: 'Tu comunidad académica, tu música, tu radio. ¡Bienvenidos a Radio UTPL!', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/carousel_home%2F6.webp?alt=media&token=3f438c0e-0226-49f7-9336-6afac2343833'}
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
