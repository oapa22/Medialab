import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { NewPodcastComponent } from './pages/new-podcast/new-podcast.component';
import { NewMessageComponent } from './pages/new-message/new-message.component';
import { ListTemplateComponent } from './pages/list-template/list-template.component';
import { adminGuard } from '../auth/guards/admin.guard';


const routes: Routes = [
  {
    path: '',
    canMatch: [adminGuard],
    component: LayoutPageComponent,
    children: [
      {path: 'lista-podcasts', component: ListTemplateComponent},
      {path: 'lista-noticias', component: ListTemplateComponent},
      {path: 'lista-mensajes', component: ListTemplateComponent},
      {path: 'lista-usuarios', component: ListTemplateComponent},
      {path: 'nuevo-noticia', component: NewProjectComponent},
      {path: 'editar-noticia/:id', component: NewProjectComponent},
      {path: 'nuevo-podcast', component: NewPodcastComponent},
      {path: 'editar-podcast/:id', component: NewPodcastComponent},
      {path: 'nuevo-mensaje', component: NewMessageComponent},
      {path: 'editar-mensaje/:id', component: NewMessageComponent},
      {path: '**', redirectTo: 'lista-podcasts'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
