import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firebase.service';
import { Podcast } from '../../../shared/interfaces/podcast.interface';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';


@Component({
    selector: 'medialab-schedule-page',
    templateUrl: './schedule-page.component.html',
    styleUrl: './schedule-page.component.css',
    standalone: false
})
export class SchedulePageComponent implements OnInit{
  public podcasts: Podcast[] = [];

  public urlSpotify:string = 'https://open.spotify.com/embed/playlist/37i9dQZF1E4yPOuEyv4Vyw?utm_source=generator';
  public safeUrl: SafeResourceUrl = '';
  public podcastFrame: SafeHtml = '';

  // DomSanitizer es empleado para verificar si la url es validad y no tenga vulneravilidades
  constructor(){
  }

  ngOnInit(): void {
  }

  // public getPodcasts(){
  //   this.firestore.getLatestDocuments<Podcast>('podcast','date',9).subscribe( podcast => {
  //     this.podcasts = podcast;
  //     console.log('hola',this.podcasts)
  //   });
  // }

  public getPodcast(podcasts: Podcast[]):void{
    this.podcasts = podcasts;
  }
}
