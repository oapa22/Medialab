import { Component } from '@angular/core';
import {
  CalendarEvent,
  CalendarView,
} from 'angular-calendar';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfDay, addHours } from 'date-fns';

@Component({
  selector: 'app-space-reservation-page',
  standalone: false,
  templateUrl: './space-reservation-page.component.html',
  styleUrls: ['./space-reservation-page.component.css']
})
export class SpaceReservationPageComponent {

  showReservationPanel: boolean = false;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [
    {
      start: startOfDay(new Date()),
      end: addHours(new Date(), 2),
      title: 'Evento de ejemplo',
      color: { primary: '#ad2121', secondary: '#FAE3E3' },
    },
  ];

  selectedDate: Date | null = null;

  constructor() {}

  ngOnInit(): void {}

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


  get eventsForSelectedDate(): CalendarEvent[] {
    if (!this.selectedDate) return [];
    return this.events.filter(event =>
      event.start.toDateString() === this.selectedDate!.toDateString()
    );
  }

  reserveSpace() {
    alert(`Reserva creada para el día ${this.selectedDate?.toLocaleDateString()}`);
    // Aquí podrías abrir un modal o formulario para reservar
  }

  closeOpenMonthViewDay() {}
}
