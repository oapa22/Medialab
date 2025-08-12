import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { ListTemplateComponent } from './pages/list-template/list-template.component';
import { CardTemplateComponent } from './components/card-template/card-template.component';
import { SharedModule } from "../shared/shared.module";
import { AdminReservationsComponent } from './components/admin-reservations/admin-reservations.component';


@NgModule({
  declarations: [
    LayoutPageComponent,
    NewProjectComponent,
    ListTemplateComponent,
    CardTemplateComponent,
    AdminReservationsComponent,

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
