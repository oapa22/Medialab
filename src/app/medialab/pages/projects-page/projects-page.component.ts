import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firebase.service';
import { Project } from '../../../shared/interfaces/project.interface';

@Component({
    selector: 'medialab-projects-page',
    templateUrl: './projects-page.component.html',
    styleUrl: './projects-page.component.css',
    standalone: false
})
export class ProjectsPageComponent implements OnInit{
  public projects:Project[] = [];

  constructor(){}

  ngOnInit(): void {

  }


  public getDocs(projects: Project[]):void{
    this.projects = projects;
  }
}
