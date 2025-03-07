// features/calendar/components/calendar-day/calendar-day.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { Observable, of, Subscription } from 'rxjs';
import { Appointment } from '../../../../core/models/appointment';
import { AppointmentItemComponent } from '../../../../shared/components/appointment-item/appointment-item.component';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { DialogService } from '../../../../shared/services/dialog.service';

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
    AppointmentItemComponent,
  ],
})
export class CalendarDayComponent implements OnInit, OnDestroy {
  @Input() date!: Date;

  @Input() isCurrentMonth = true;

  @Output() newAppointment = new EventEmitter<Date>();

  @Input() dropListId!: string;

  @Input() connectedDropListIds: string[] = [];

  @Output() appointmentDrop = new EventEmitter<CdkDragDrop<Appointment[]>>();

  appointments$: Observable<Appointment[]> = of([]);

  private subscription = new Subscription();

  private dialogService = inject(DialogService);

  protected dialog = inject(MatDialog);

  private appointmentService = inject(AppointmentService);

  ngOnInit(): void {
    this.appointments$ = this.appointmentService.getAppointmentsByDate(
      this.date
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addAppointment(): void {
    if (this.dialogService.isEditAppointmentOpened()) {
      return;
    }
    this.newAppointment.emit(this.date);
  }

  onDeleteAppointment(id: string): void {
    console.log(id);
    this.appointmentService.deleteAppointment(id);
  }

  onEditAppointment(appointment: Appointment): void {
    this.dialogService.closeNewAppointmentDialog();
    this.dialogService.openEditAppointmentDialog();
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: {
        date: appointment.date,
        appointment: appointment,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.appointmentService.updateAppointment(result);
        this.dialogService.closeEditAppointmentDialog();
      }
    });
  }

  onAppointmentDrop(event: CdkDragDrop<Appointment[]>) {
    this.appointmentDrop.emit(event);
  }
}
