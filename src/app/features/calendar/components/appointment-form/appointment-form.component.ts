// features/calendar/components/appointment-form/appointment-form.component.ts
import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Appointment } from '../../../../core/models/appointment';
import { DialogService } from '../../../../shared/services/dialog.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class AppointmentFormComponent implements OnInit, OnDestroy {
  appointmentForm!: FormGroup;
  timeSlots: string[] = [];
  colors: string[] = [
    '#FF5252',
    '#FF4081',
    '#7C4DFF',
    '#536DFE',
    '#448AFF',
    '#40C4FF',
    '#18FFFF',
    '#64FFDA',
    '#69F0AE',
    '#B2FF59',
  ];
  private dialogService = inject(DialogService);
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { date: Date; appointment?: Appointment }
  ) {
    // Generate time slots from 8:00 AM to 8:00 PM in 30-minute intervals
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        this.timeSlots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
  }

  ngOnInit(): void {
    this.initForm();

    // When start time changes, automatically set end time 30 minutes later
    this.appointmentForm
      .get('startTime')
      ?.valueChanges.subscribe((startTime) => {
        if (startTime) {
          const startIndex = this.timeSlots.findIndex(
            (time) => time === startTime
          );
          if (startIndex < this.timeSlots.length - 1) {
            this.appointmentForm
              .get('endTime')
              ?.setValue(this.timeSlots[startIndex + 1]);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.dialogService.closeEditAppointmentDialog();
    this.dialogService.closeNewAppointmentDialog();
  }

  initForm(): void {
    const appointment = this.data.appointment;

    this.appointmentForm = this.fb.group({
      title: [
        appointment?.title || '',
        [Validators.required, Validators.maxLength(50)],
      ],
      description: [appointment?.description || ''],
      startTime: [
        appointment?.startTime || this.timeSlots[0],
        Validators.required,
      ],
      endTime: [appointment?.endTime || this.timeSlots[1], Validators.required],
      color: [appointment?.color || this.colors[0]],
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;

      const appointment: Appointment = {
        id: this.data.appointment?.id || '',
        title: formValue.title,
        description: formValue.description,
        date: this.data.date,
        startTime: formValue.startTime,
        endTime: formValue.endTime,
        color: formValue.color,
      };

      this.dialogRef.close(appointment);
    }
  }

  onCancel(): void {
    this.dialogService.closeNewAppointmentDialog();
    this.dialogService.closeEditAppointmentDialog();
    this.dialogRef.close();
  }
}
