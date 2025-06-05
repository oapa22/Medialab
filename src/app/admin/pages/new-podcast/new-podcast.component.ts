import { Podcast } from './../../../shared/interfaces/podcast.interface';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from './../../../medialab/services/firebase.service';
import { Timestamp } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ResquestLoaderRenderService } from '../../../shared/renders/resquest-loader.service';
import { CounterDocService } from '../../../shared/services/counter-doc.service';

@Component({
    selector: 'admin-new-podcast',
    templateUrl: './new-podcast.component.html',
    styleUrls: ['./new-podcast.component.css'],
    providers: [DatePipe],
    standalone: false
})
export class NewPodcastComponent implements OnInit {
  date = '';
  dateN = '';
  public podcast: Podcast = {
    id: '',
    title: '',
    date: Timestamp.now(),
    frame: '',
  };

  // Form para agrupar los elementos del Podcast
  public podcastForm = new FormGroup({
    title: new FormControl<string>(''),
    frame: new FormControl<string>(''),
  });

  public currentDate: string = '';
  public currentRoute: string = '';

  constructor(
    private firestore: FirestoreService,
    private counterService:CounterDocService,
    private datePipe: DatePipe,
    private requestLoader: ResquestLoaderRenderService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formatDate();
    this.currentRoute = this.router.url;

    if (this.router.url.includes('editar-podcast')) {
      this.activatedRouter.params.pipe(
        switchMap(({ id }) => this.firestore.getDocPodcast<Podcast>('podcast', id))
      ).subscribe(podcast => {
        if (!podcast) {
          this.router.navigateByUrl('/');
          return;
        }

        this.podcast = podcast;
        this.podcastForm.reset(podcast);
        this.formatDate();
      });
    } else {
      this.formatDate();
    }
  }


  createPodcast() {
    let title: string = 'CREANDO PODCAST';
    let description: string = 'Espere un momento mientras los datos se suben en la nube.';
    this.requestLoader.initRequestLoader(title, description);

    const path = 'podcast';
    const id = this.firestore.createId();

    this.podcast = this.currentPodcastFormValue;

    this.podcast.id = id;
    this.podcast.date = Timestamp.now();

    this.firestore.createDoc(this.podcast, path, id).then(res => {
      console.log('respuesta ->', res);

      this.counterService.incrementCounter('podcast').then( (res) => {
        // console.log('Se incremento el contador podcast');
        this.requestLoader.closeRequestLoader();
      }).catch((error) => {
        console.error('Error al actualizar el mensaje:', error);
        this.requestLoader.closeRequestLoader();
      });
    });
  }

  updatePodcast(): void {
    let title: string = 'ACTUALIZANDO PODCAST';
    let description: string = 'Espere un momento mientras los datos se actualizan en la nube.';
    this.requestLoader.initRequestLoader(title, description);

    const updatedPodcast = this.podcastForm.value as Podcast;

    if (this.podcast.id) {
      const path = 'podcast';
      const id = this.podcast.id;

      this.firestore.updateDoc(path, id, updatedPodcast).then(() => {
        this.requestLoader.closeRequestLoader();
      }).catch((error) => {
        console.error('Error al actualizar el podcast:', error);
        this.requestLoader.closeRequestLoader();
      });
    }
  }


  formatDate() {
    const date = this.podcast.date.toDate();

    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const anio = date.getFullYear();

    this.date = `${dia} de ${mes} de ${anio}`;
    this.dateN = `${dia} de ${mes} de ${anio}`;
  }

  public get currentPodcastFormValue(): Podcast {
    const podcast = this.podcastForm.value as Podcast;
    podcast.date = this.podcast.date;  // Mantener la fecha original
    return podcast;
  }
}
