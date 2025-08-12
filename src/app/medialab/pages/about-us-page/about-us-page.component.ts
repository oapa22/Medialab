import { Component } from '@angular/core';
import { MediaElement } from '../../interfaces/media-element.interface';

@Component({
    selector: 'medialab-about-us-page',
    templateUrl: './about-us-page.component.html',
    styleUrl: './about-us-page.component.css',
    standalone: false
})
export class AboutUsPageComponent {
  public mediaTeamMediaLab:MediaElement[] = [
    {id: '01',title:'Directora del departamento de Ciencias de la Comunicación UTPL', description: 'Ph.D. Ana María Beltrán Flandoli', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/media%2Fana_beltran.webp?alt=media&token=4275c677-bf64-4db6-a6fc-ff35e7b8651f'},
    {id: '02',title:'Técnico de MediaLab UTPL', description: 'Mgtr. Milenny Suquilanda Ramírez', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/radioutpl.appspot.com/o/media%2Flourdes_quezada.webp?alt=media&token=884522e7-56d8-474c-b8f0-18ae853aabab'},
  ]
}
