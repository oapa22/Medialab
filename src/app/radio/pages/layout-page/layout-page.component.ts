import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserRoute } from '../../interfaces/browser-route';

@Component({
    selector: 'radio-layout-page',
    templateUrl: './layout-page.component.html',
    styleUrl: './layout-page.component.css',
    standalone: false
})
export class LayoutPageComponent implements OnInit {


  public browserRoutes:BrowserRoute[] = [
    {titleRoute: 'Inicio', route: './inicio'},
    {titleRoute: '¿Quienes Somos?', route: './quienes-somos'},
    {titleRoute: 'Programación', route: './programacion'},
    {titleRoute: 'Proyectos', route: './proyectos'},
    {titleRoute: 'Contactos', route: './contacto'},
  ];

  public routeData:BrowserRoute = {titleRoute:'', route: ''};

  constructor(public router:Router){
  }

  ngOnInit(): void {
    this.getCurrentRoute();
  }

  public getCurrentRoute():string{
    const stringRoute:string = this.router.url;
    return stringRoute;
  }

  public getCurrentTitleRoute():string{
    const currentRoute:string = this.getCurrentRoute();

    for(let data of this.browserRoutes){
      if ( currentRoute.includes(data.route.replace('.','')) ){
        return data.titleRoute;
      }
    }
    return 'Administrador';
  }

}
