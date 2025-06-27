import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { ReservationModalComponent } from '../../components/reservation-modal/reservation-modal.component';
import { FirestoreService } from '../../services/firebase.service';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timestamp } from '@angular/fire/firestore';
import { Reservation } from '../../../shared/interfaces/reservation.intertafe';
import { User } from '../../../shared/interfaces/user.interface';
import { AuthServiceService } from '../../../auth/services/auth.service';
import { switchMap } from 'rxjs/operators';
import { ResquestLoaderRenderService } from '../../../shared/renders/resquest-loader.service';

@Component({
  selector: 'app-space-reservation-page',
  templateUrl: './space-reservation-page.component.html',
  styleUrls: ['./space-reservation-page.component.css'],
  standalone: false,
})
export class SpaceReservationPageComponent implements OnInit, OnDestroy {
  showReservationPanel: boolean = false;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  selectedDate: Date | null = null;
  private subscription: Subscription = new Subscription();
  currentUserId!: string ;
  docId!: string;

  user: User = {
    uid: '',
    id: '',
    names: '',
    email: '',
    password: '',
    isAdmin: false,
    likedProjects: [],
    date: Timestamp.now(),
  }

  constructor(
    private dialog: MatDialog,
    private auth: AuthServiceService,
    private firestoreService: FirestoreService,
    private requestLoader:ResquestLoaderRenderService
    
  ) {}

  ngOnInit(): void {
    // Obtener ID del usuario actual
    this.auth.stateUser().subscribe(res => {
      if (res) {
        this.currentUserId = res.uid;
        this.getUser()
      }
    });
    // this.auth.onAuthStateChanged((user) => {
    //   this.currentUserId = user ? user.uid : null;
    //   this.loadReservations();
    // });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getUser(){
    const path = 'user'
    this.firestoreService.getDocProject<User>(path, this.currentUserId).subscribe( res => {
      this.user = {
        uid: res!.uid,
        id: res!.id,
        names: res!.names,
        email: res!.email,
        password: '',
        isAdmin: res!.isAdmin,
        likedProjects: res!.likedProjects,
        date: res!.date
      };
      this.loadReservations();
    });
  }

loadReservations(): void {
  if (!this.currentUserId) return;

  const acceptedReservations$ = this.firestoreService
    .getFilteredCollection<Reservation>('reservations', 'status', 'Aceptada')
    .pipe(
      map((reservations) =>
        reservations.map((res) => ({
          id: res.id,
          title: `${res.title} (${res.room})`,
          start: res.start.toDate(),
          end: res.end.toDate(),
          color: {
            primary: res.eventType === 'Presencial' ? '#ad2121' : '#1e90ff',
            secondary: '#FAE3E3',
          },
          meta: { ...res, userName: '' }, // Inicializar nombre
        }))
      )
    );

  const pendingReservations$ = this.firestoreService
    .getFilteredCollection<Reservation>('reservations', 'status', 'Pendiente')
    .pipe(
      map((reservations) =>
        reservations
          .filter((res) => res.userId === this.currentUserId)
          .map((res) => ({
            id: res.id,
            title: `${res.title} (${res.room}) - Pendiente`,
            start: res.start.toDate(),
            end: res.end.toDate(),
            color: {
              primary: '#ff9900',
              secondary: '#FFF3E0',
            },
            meta: { ...res, userName: '' },
          }))
        )
      );

  this.subscription.add(
    combineLatest([acceptedReservations$, pendingReservations$])
      .pipe(
        map(([accepted, pending]) => [...accepted, ...pending]),
        switchMap((events) =>
          combineLatest(
            events.map((event) =>
              this.firestoreService.getUserById(event.meta.userId).pipe(
                map((user) => ({
                  ...event,
                  meta: { ...event.meta, userName: user?.names || 'Desconocido' },
                }))
              )
            )
          )
        )
      )
      .subscribe((events) => {
        this.events = events;
      })
    );
  } 

  setView(view: CalendarView) {
    this.view = view;
  }

  previous() {
    if (this.view === CalendarView.Month) {
      this.viewDate = subMonths(this.viewDate, 1);
    } else if (this.view === CalendarView.Week) {
      this.viewDate = subWeeks(this.viewDate, 1);
    } else if (this.view === CalendarView.Day) {
      this.viewDate = subDays(this.viewDate, 1);
    }
  }

  next() {
    if (this.view === CalendarView.Month) {
      this.viewDate = addMonths(this.viewDate, 1);
    } else if (this.view === CalendarView.Week) {
      this.viewDate = addWeeks(this.viewDate, 1);
    } else if (this.view === CalendarView.Day) {
      this.viewDate = addDays(this.viewDate, 1);
    }
  }

  today() {
    this.viewDate = new Date();
  }

  dayClicked(date: Date): void {
    this.viewDate = date;
    this.selectedDate = date;
    this.showReservationPanel = true;
  }

  reserveSpace() {
    if (!this.selectedDate || !this.currentUserId) {
      console.error('No se ha seleccionado una fecha o no hay usuario logueado');
      return;
    }
    const dialogRef = this.dialog.open(ReservationModalComponent, {
      width: '500px',
      maxHeight: '90vh',
      position: { top: '10px' },
      data: { selectedDate: this.selectedDate },
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const reservationId = this.firestoreService.createId();
        const reservationData: Reservation = {
          id: reservationId,
          title: result.title,
          eventType: result.eventType,
          room: result.room,
          start: Timestamp.fromDate(result.start),
          end: Timestamp.fromDate(result.end),
          participants: result.participants,
          observations: result.observations,
          status: 'Pendiente',
          userId: this.currentUserId!,
        };
        this.firestoreService
          .createDoc(reservationData, 'reservations', reservationId)
          .then(() => console.log('Reserva guardada con éxito'))
          .catch((error) => console.error('Error al guardar la reserva:', error));
      }
    });
  }

  cancelReservation(reservationId: string) {

    this.requestLoader.initRequestLoader(
      'CANCELANDO RESERVA',
      'Espere un momento mientras se elimina la reserva.'
    );

    this.firestoreService
      .deleteDoc('reservations', reservationId)
      .then(() => {
        this.requestLoader.closeRequestLoader();
      })
      .catch((error) => {
        console.error('Error al cancelar la reserva:', error);
        this.requestLoader.closeRequestLoader();
      });
  }

  get eventsForSelectedDate(): CalendarEvent[] {
    if (!this.selectedDate) return [];
    return this.events.filter(
      (event) => event.start.toDateString() === this.selectedDate!.toDateString()
    );
  }

  closeOpenMonthViewDay() {}

  viewEventDetails(event: CalendarEvent): void {
    console.log('Detalles del evento:', event.meta);
  }
}