import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404PageComponent } from './pages/error-404-page/error-404-page.component';
import { CardPodcastComponent } from './components/card-podcast/card-podcast.component';
import { CardProjectsComponent } from './components/card-project/card-projects.component';
import { SharedRoutingModule } from './shared-routing.module';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MaterialModule } from '../material_module/material.module';
import { ResquestLoaderComponent } from './renders/resquest-loader/resquest-loader.component';
import { PaginationComponent } from './components/pagination/pagination.component';


@NgModule({
  declarations: [
    Error404PageComponent,
    CardPodcastComponent,
    CardProjectsComponent,
    ConfirmDialogComponent,
    ResquestLoaderComponent,
    PaginationComponent,

  ],
  imports: [
    CommonModule,
    SharedRoutingModule,

    MaterialModule
  ],
  exports: [
    Error404PageComponent,
    CardPodcastComponent,
    CardProjectsComponent,
    PaginationComponent
  ]
})
export class SharedModule { }
