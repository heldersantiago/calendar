// shared/components/appointment-item/appointment-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppointmentFormComponent } from '../../../features/calendar/components/appointment-form/appointment-form.component';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment';

@Component({
  selector: 'app-appointment-item',
  templateUrl: './appointment-item.component.html',
  styleUrls: ['./appointment-item.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
})
export class AppointmentItemComponent {
  @Input() appointment!: Appointment;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Appointment>();

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.appointment.id);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.appointment);
  }
}
