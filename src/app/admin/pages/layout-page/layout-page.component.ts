import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'admin-layout-page',
    templateUrl: './layout-page.component.html',
    styleUrl: './layout-page.component.css',
    standalone: false
})
export class LayoutPageComponent implements OnInit{
  public valueLabel:string = 'podcast';

  /**
   * Propidad router: empleado para cambiar el contenido de la seccion
   */
  constructor(private router:Router){
  }
  ngOnInit(): void {
    if (this.router.url.includes('lista-podcasts')) {
      this.valueLabel = 'podcast';
    } else if (this.router.url.includes('lista-noticias')) {
      this.valueLabel = 'noticia';
    } else if (this.router.url.includes('lista-mensajes')) {
      this.valueLabel = 'mensaje';
    } else if(this.router.url.includes('lista-usuarios')){
      this.valueLabel = 'usuario';
    } else {
      this.router.navigate(['/radio-utpl/admin/']);
    }
  }



  //Funcion para cambiar el valor del contenido del boton.
  public updateButtonLabel(valueLabel:'podcast'|'noticia'|'mensaje'|'usuario'):void{
    this.valueLabel = valueLabel;
  }


}
