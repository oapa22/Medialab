import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import moment from 'moment';

@Component({
  selector: 'app-reservation-modal',
  templateUrl: './reservation-modal.component.html',
  styleUrls: ['./reservation-modal.component.css'],
  standalone: false,
})
export class ReservationModalComponent {
  reservationForm: FormGroup;
  rooms = ['Set de TV', 'Sala de reuniones'];
  eventTypes: string[] = [];
  roomEventTypes: { [key: string]: string[] } = {
    'Set de TV': ['Taller', 'Clase práctica', 'Clase experimental', 'Grabación entrevista', 'Sesión de fotos'],
    'Sala de reuniones': ['Taller', 'Reunión de trabajo'],
  };


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReservationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedDate: Date }
  ) {
    this.reservationForm = this.fb.group({
      title: ['', [Validators.required]],
      eventType: [{ value: '', disabled: true }, [Validators.required]],
      room: ['', [Validators.required]],
      startDate: [new Date(this.data.selectedDate), [Validators.required]],
      startTime: ['08:00', [Validators.pattern(/([0-1]?[0-9]|2[0-3]):[0-5][0-9]/)]],
      endDate: [new Date(this.data.selectedDate), [Validators.required]],
      endTime: ['10:00', [Validators.pattern(/([0-1]?[0-9]|2[0-3]):[0-5][0-9]/)]],
      participants: ['', [Validators.required, Validators.min(1)]],
      observations: [''],
    });


    this.reservationForm.get('room')?.valueChanges.subscribe((room) => {
      if (room) {
        this.eventTypes = this.roomEventTypes[room] || [];
        this.reservationForm.get('eventType')?.enable();
        this.reservationForm.get('eventType')?.setValue('');
      } else {
        this.eventTypes = [];
        this.reservationForm.get('eventType')?.disable();
        this.reservationForm.get('eventType')?.setValue('');
      }
    });
  }



  addEmail(event: MatChipInputEvent): void {
    const input = event.input;
    const value = (event.value || '').trim();

    if (value && this.isValidEmail(value)) {
      const emails = this.reservationForm.get('emails')?.value;
      emails.push(value);
      this.reservationForm.get('emails')?.setValue(emails);
    }

    if (input) {
      input.value = '';
    }
  }

  removeEmail(email: string): void {
    const emails = this.reservationForm.get('emails')?.value;
    const index = emails.indexOf(email);
    if (index >= 0) {
      emails.splice(index, 1);
      this.reservationForm.get('emails')?.setValue(emails);
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const { startDate, startTime, endDate, endTime, ...otherValues } = this.reservationForm.value;

      // Combinar fecha y hora usando Moment.js
      const start = moment(startDate)
        .set({
          hour: parseInt(startTime.split(':')[0], 10),
          minute: parseInt(startTime.split(':')[1], 10),
        })
        .toDate();

      const end = moment(endDate)
        .set({
          hour: parseInt(endTime.split(':')[0], 10),
          minute: parseInt(endTime.split(':')[1], 10),
        })
        .toDate();

      this.dialogRef.close({
        ...otherValues,
        start,
        end,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}