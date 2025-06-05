import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MediaElement } from '../../interfaces/media-element.interface';
import { FirestoreService } from '../../services/firebase.service';
import { Message } from '../../../shared/interfaces/message.interface';

@Component({
    selector: 'medialab-message-board',
    templateUrl: './message-board.component.html',
    styleUrl: './message-board.component.css',
    animations: [
        trigger('carouselAnimation', [
            transition('void => *', [
                style({ opacity: 0 }),
                animate('300ms', style({ opacity: 1 }))
            ]),
            transition('* => void', [
                animate('300ms', style({ opacity: 0 }))
            ])
        ])
    ],
    standalone: false
})
export class MessageBoardComponent implements OnInit{
  public messages:Message[] = [];
  public audioPlay:boolean = false;

  // public currentAudio: HTMLAudioElement = new Audio();

  // public messageMediaElement:MediaElement[] = [
  //   {id: '01', title: 'Tu voz, tu fuerza 1', imgSrc: 'https://st3.depositphotos.com/3433891/33504/i/450/depositphotos_335048212-stock-photo-young-caucasian-woman-isolated-who.jpg', linkContent: 'https://www.youtube.com/watch?v=Lm77VCkf_do'},
  //   {id: '02', title: 'Tu voz, tu fuerza 2' , imgSrc: 'https://tuvoz.tv/wp-content/uploads/2024/06/WhatsApp-Image-2024-06-05-at-7.26.35-PM.jpeg'}
  // ];

  public currentPosition:number = 0;

  constructor(private firestoreService:FirestoreService){}

  ngOnInit(): void {
    this.getMessages();
  }

  public toogleAudio(){
    this.audioPlay = !this.audioPlay;
    console.log(this.audioPlay);
  }

  public playAudio(audioPlayer: HTMLAudioElement):void{

    if(this.audioPlay == false){
      audioPlayer.play();
    }else{
      audioPlayer.pause();
    }

    this.toogleAudio();

  }

  public onAudioEnded(){
    this.audioPlay = false;
  }

  public nextImage():void{
    const next:number = this.currentPosition + 1;
    this.currentPosition = next == this.messages.length ? 0 : next;
  }

  public prevImage():void{

    const prev:number = this.currentPosition - 1;
    this.currentPosition = prev < 0 ? this.messages.length - 1 : prev;

  }

  public getMessages():void{
    this.firestoreService.getCollection<Message>('message').subscribe(messages => {
      this.messages = messages;
    });
  }

}
