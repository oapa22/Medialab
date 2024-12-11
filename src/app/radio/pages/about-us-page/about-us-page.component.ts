import { Component } from '@angular/core';
import { MediaElement } from '../../interfaces/media-element.interface';

@Component({
    selector: 'radio-about-us-page',
    templateUrl: './about-us-page.component.html',
    styleUrl: './about-us-page.component.css',
    standalone: false
})
export class AboutUsPageComponent {
  public mediaTeamMediaLab:MediaElement[] = [
    {id: '01',title:'Directora del departamento de Ciencias de la Comunicación de UTPL', description: 'Ana Maria Beltrán', imgSrc: 'https://e7.pngegg.com/pngimages/820/233/png-clipart-management-service-business-consultant-employment-students-company-service.png'},
    {id: '02',title:'Técnico de Radio UTPL', description: 'Lourdes Quezada Loaiza', imgSrc: 'https://e7.pngegg.com/pngimages/820/233/png-clipart-management-service-business-consultant-employment-students-company-service.png'},
  ]
}
