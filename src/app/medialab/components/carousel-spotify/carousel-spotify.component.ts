import { Component } from '@angular/core';

@Component({
    selector: 'raido-carousel-spotify',
    templateUrl: './carousel-spotify.component.html',
    styleUrl: './carousel-spotify.component.css',
    standalone: false
})
export class CarouselSpotifyComponent {
  cards = [
    { title: 'Card 1' },
    { title: 'Card 2' },
    { title: 'Card 3' },
    { title: 'Card 4' }
    // Añade más tarjetas según sea necesario
  ];

  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    this.updateCarouselPosition();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    this.updateCarouselPosition();
  }

  private updateCarouselPosition() {
    const carouselWrapper = document.querySelector('.carousel-wrapper') as HTMLElement;
    const cardWidth = document.querySelector('.carousel-card')?.clientWidth || 0;
    const offset = -this.currentIndex * (cardWidth + 16); // Ajusta el 16 según el margen
    carouselWrapper.style.transform = `translateX(${offset}px)`;
  }


}
