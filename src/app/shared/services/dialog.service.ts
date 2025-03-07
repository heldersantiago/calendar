import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DialogService {
  isNewAppointmentOpened = signal(false);
  isEditAppointmentOpened = signal(false);

  openNewAppointmentDialog(): void {
    this.isNewAppointmentOpened.set(true);
  }

  closeNewAppointmentDialog(): void {
    this.isNewAppointmentOpened.set(false);
  }

  openEditAppointmentDialog(): void {
    this.isEditAppointmentOpened.set(true);
  }

  closeEditAppointmentDialog(): void {
    this.isEditAppointmentOpened.set(false);
  }
}
