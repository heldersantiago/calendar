// features/calendar/components/calendar-day/calendar-day.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { Observable, Subscription } from 'rxjs';
import { AppointmentItemComponent } from '../../../../shared/components/appointment-item/appointment-item.component';
import { Appointment } from '../../../../core/models/appointment';

@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    DragDropModule,
  ],
})
export class CalendarDayComponent implements OnInit, OnDestroy {
  @Input() date!: Date;
  @Input() isCurrentMonth = true;
  @Output() newAppointment = new EventEmitter<Date>();

  appointments$!: Observable<Appointment[]>;
  private subscription = new Subscription();

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.appointments$ = this.appointmentService.getAppointmentsByDate(
      this.date
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addAppointment(): void {
    this.newAppointment.emit(this.date);
  }

  deleteAppointment(id: string, event: Event): void {
    event.stopPropagation();
    this.appointmentService.deleteAppointment(id);
  }

  onDrop(event: CdkDragDrop<Appointment[]>): void {
    if (event.previousContainer === event.container) {
      // Same day, just reordering
      return;
    }

    // Get the dragged appointment
    const appointmentId = event.item.data;

    // Update the appointment with the new date
    this.appointmentService.moveAppointment(appointmentId, this.date);
  }
}
