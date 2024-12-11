import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../interfaces/project.interface';

@Component({
    selector: 'shared-card-project',
    templateUrl: './card-projects.component.html',
    styleUrl: './card-projects.component.css',
    standalone: false
})
export class CardProjectsComponent implements OnInit{

  @Input()
  public project!:Project;

  public hasLoaded:boolean = false;
  public date: string = '';

  ngOnInit(): void {
    if(!this.project) throw new Error('Project property is required');
    this.formatDateProjects(this.project);
  }

  public onLoad():void{
    this.hasLoaded = true;
  }

  public formatDateProjects(project:Project) {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const date = project.date.toDate();
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const anio = date.getFullYear();
    this.date = `${dia} de ${mes} de ${anio}`;

  }
}
