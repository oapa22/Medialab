import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { MedialabRoutingModule } from './medialab-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { SchedulePageComponent } from './pages/schedule-page/schedule-page.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { SharedModule } from '../shared/shared.module';
import { SectionAboutUsComponent } from './components/section-about-us/section-about-us.component';
import { SectionScheduleComponent } from './components/section-schedule/section-schedule.component';
import { ElementMedialabComponent } from './components/element-medialab/element-medialab.component';
import { MessageBoardComponent } from './components/message-board/message-board.component';
import { CarouselSpotifyComponent } from './components/carousel-spotify/carousel-spotify.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ProjectTemplateComponent } from './pages/project-template/project-template.component';
import { ReservationModalComponent } from './components/reservation-modal/reservation-modal.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MaterialModule } from '../material_module/material.module';
import { TruncatePipe } from './pipes/truncate.pipe';
import { SpaceReservationPageComponent } from './pages/space-reservation-page/space-reservation-page.component';
import { NewsPageComponent } from './pages/news-page/news-page.component';
import { JobBoardPageComponent } from './pages/job-board-page/job-board-page.component';
import { HardwarePageComponent } from './pages/hardware-page/hardware-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { JobBoardModalComponent } from './components/job-board-modal/job-board-modal.component';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    LayoutPageComponent,
    HomePageComponent,
    AboutUsPageComponent,
    SchedulePageComponent,
    ProjectsPageComponent,
    ContactPageComponent,
    HeaderComponent,
    FooterComponent,
    CarouselComponent,
    SectionAboutUsComponent,
    SectionScheduleComponent,
    ElementMedialabComponent,
    MessageBoardComponent,
    CarouselSpotifyComponent,
    PaginationComponent,
    ProjectTemplateComponent,
    ConfirmDialogComponent,
    TruncatePipe,
    SpaceReservationPageComponent,
    NewsPageComponent,
    JobBoardPageComponent,
    HardwarePageComponent,
    ReservationModalComponent,
    JobBoardModalComponent,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }, 
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
  ],
  imports: [
    CommonModule,
    MedialabRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FlatpickrModule.forRoot(),
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
})
export class MedialabModule {}