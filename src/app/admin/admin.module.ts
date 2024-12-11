import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { NewPodcastComponent } from './pages/new-podcast/new-podcast.component';
import { NewMessageComponent } from './pages/new-message/new-message.component';
import { ListTemplateComponent } from './pages/list-template/list-template.component';
import { CardTemplateComponent } from './components/card-template/card-template.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    LayoutPageComponent,
    NewProjectComponent,
    NewPodcastComponent,
    NewMessageComponent,
    ListTemplateComponent,
    CardTemplateComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    EditorModule,
    SharedModule
]
})
export class AdminModule { }
