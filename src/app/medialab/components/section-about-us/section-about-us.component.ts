import { Component } from '@angular/core';

@Component({
    selector: 'medialab-section-about-us',
    templateUrl: './section-about-us.component.html',
    styleUrl: './section-about-us.component.css',
    standalone: false
})
export class SectionAboutUsComponent {
  public isPlay:boolean = false;
  public showButtonPlay:boolean = true;

  constructor(){}

  public toogleVideo():void{
    this.isPlay = !this.isPlay;
    this.showButtonPlay = !this.showButtonPlay;
  }

  public playVideo(video: HTMLVideoElement):void{
    if(!this.isPlay){
      video.play();
    } else {
      video.pause();
    }

    this.toogleVideo();
  }

  public pauseVideo():void{

  }
}
