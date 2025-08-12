import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { ProjectTemplateComponent } from './pages/project-template/project-template.component';

import { JobBoardPageComponent } from './pages/job-board-page/job-board-page.component';
import { NewsPageComponent } from './pages/news-page/news-page.component';
import { SpaceReservationPageComponent } from './pages/space-reservation-page/space-reservation-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {path: 'inicio', component: HomePageComponent},
      {path: 'quienes-somos', component: AboutUsPageComponent},
      {path: 'bolsa-empleo', component: JobBoardPageComponent},
      {path: 'reserva-espacios', component: SpaceReservationPageComponent},
      {path: 'contacto', component: ContactPageComponent},
      {path: 'noticias', component: ProjectsPageComponent},
      {path: 'noticias/contenido/:id', component: ProjectTemplateComponent},
      {
        path: 'admin',
        loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'autenticacion',
        loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)
      },
      {path: '**', redirectTo: 'inicio'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedialabRoutingModule { }
