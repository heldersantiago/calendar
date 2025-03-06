// features/calendar/calendar.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChangeDetectionStrategy } from '@angular/core';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { CalendarDayComponent } from './components/calendar-day/calendar-day.component';
import { AppointmentService } from '../../core/services/appointment.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    CalendarDayComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
  calendarDays: Date[] = [];
  currentMonth: Date = new Date();

  constructor(
    private dialog: MatDialog,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.generateCalendarDays(this.currentMonth);
  }

  generateCalendarDays(month: Date): void {
    // Reset days array
    this.calendarDays = [];

    // Get the first day of the month
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);

    // Get the last day of the month
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    // Get the day of the week (0-6) of the first day
    const firstDayOfWeek = firstDay.getDay();

    // Add previous month's days to complete the first week
    const prevMonthLastDay = new Date(month.getFullYear(), month.getMonth(), 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDay = new Date(month.getFullYear(), month.getMonth() - 1, prevMonthLastDay - i);
      this.calendarDays.push(prevMonthDay);
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentMonthDay = new Date(month.getFullYear(), month.getMonth(), i);
      this.calendarDays.push(currentMonthDay);
    }

    // Add next month's days to complete the last week
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const nextMonthDay = new Date(month.getFullYear(), month.getMonth() + 1, i);
      this.calendarDays.push(nextMonthDay);
    }
  }

  openNewAppointmentDialog(date: Date): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: { date: date }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.addAppointment(result);
      }
    });
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendarDays(this.currentMonth);
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendarDays(this.currentMonth);
  }

  getMonthName(date: Date): string {
    return date.toLocaleString('default', { month: 'long' });
  }
}
