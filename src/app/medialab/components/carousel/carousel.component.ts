import { Component, Input, OnInit } from '@angular/core';
import { MediaElement } from '../../interfaces/media-element.interface';

import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'medialab-carousel',
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.css',
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
export class CarouselComponent implements OnInit{
  // Custom Properties
  @Input() public height:number = 500;
  @Input() fullScreen:boolean = false;
  @Input() mediaElement:MediaElement[] = [];
  @Input() intervalTime:number = 0;
  @Input() currentRoute:string = '';

  // Final Properties
  public currentPosition:number = 0;
  private intervalAutoSlide = setInterval(() => {}, 0);
  public isHidden = false;

  constructor(){

  }

  ngOnInit(): void {
    this.startAutoSlide();
  }

  // Inicializar intervalo
  public startAutoSlide():void{
    if (this.mediaElement.length > 0){

      this.intervalAutoSlide = setInterval(() => {
        this.nextImage();
      }, this.intervalTime);

    }
  }

  public clearAutoSlide():void{
    if (this.intervalAutoSlide) {
      clearInterval(this.intervalAutoSlide);
    }
  }

  public resetAutoSlide():void {
    this.clearAutoSlide();
    this.startAutoSlide();
  }

  public nextImage():void{
    const next:number = this.currentPosition + 1;
    this.currentPosition = next == this.mediaElement.length ? 0 : next;
    this.resetAutoSlide();
  }

  public prevImage():void{
    const prev:number = this.currentPosition - 1;
    this.currentPosition = prev < 0 ? this.mediaElement.length - 1 : prev;
    this.resetAutoSlide();
  }

  public goImage(index:number):void{
    if (this.mediaElement.length > 0){
      this.currentPosition = index;
    }
  }

  // Empleada para realizar animacion de transicion
  get currentTransform():string {
    return `translateX(-${this.currentPosition * 100}%)`;
  }

  ngOnDestroy(){
    clearInterval(this.intervalAutoSlide);
  }

}
