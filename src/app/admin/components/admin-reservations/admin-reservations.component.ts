import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirestoreService } from '../../../medialab/services/firebase.service';
import { Reservation } from '../../../shared/interfaces/reservation.intertafe';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.component.html',
  styleUrls: ['./admin-reservations.component.css'],
  standalone: false,
})
export class AdminReservationsComponent implements OnInit, OnDestroy {
  pendingReservations: Reservation[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private firestoreService: FirestoreService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPendingReservations();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadPendingReservations(): void {
    this.subscription.add(
      this.firestoreService
        .getFilteredCollection<Reservation>('reservations', 'status', 'Pendiente')
        .pipe(
          map((reservations) => reservations)
        )
        .subscribe((reservations) => {
          this.pendingReservations = reservations;
        })
    );
  }

  acceptReservation(reservation: Reservation): void {
    if (reservation.id) {
      this.firestoreService
        .updateDoc('reservations', reservation.id, { status: 'Aceptada' })
        .then(() => {
          console.log('Reserva aceptada');
        })
        .catch((error) => {
          console.error('Error al aceptar la reservación:', error);
        });
    }
  }

  rejectReservation(reservation: Reservation): void {
    if (reservation.id) {
      this.firestoreService
        .deleteDoc('reservations', reservation.id)
        .then(() => {
          console.log('Reserva rechazada y eliminada');
        })
        .catch((error) => {
          console.error('Error al rechazar la reservación:', error);
        });
    }
  }
}