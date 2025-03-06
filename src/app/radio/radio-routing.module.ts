import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { SchedulePageComponent } from './pages/schedule-page/schedule-page.component';
import { ProjectTemplateComponent } from './pages/project-template/project-template.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {path: 'inicio', component: HomePageComponent},
      {path: 'quienes-somos', component: AboutUsPageComponent},
      {path: 'contacto', component: ContactPageComponent},
      {path: 'noticias', component: ProjectsPageComponent},
      {path: 'noticias/contenido/:id', component: ProjectTemplateComponent},
      {path: 'programacion', component: SchedulePageComponent},
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
export class RadioRoutingModule { }
