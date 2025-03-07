// core/services/appointment.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment } from '../models/appointment';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointments = new BehaviorSubject<Appointment[]>([]);

  constructor() {
    // Load from localStorage if available
    if (this.isLocalStorageAvailable()) {
      const savedAppointments = localStorage.getItem('appointments');

      if (savedAppointments) {
        const parsedAppointments = JSON.parse(savedAppointments);

        // Convert string dates back to Date objects
        const appointments = parsedAppointments.map((appointment: any) => ({
          ...appointment,
          date: new Date(appointment.date),
        }));

        this.appointments.next(appointments);
      }
    }
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointments.asObservable();
  }

  getAppointmentsByDate(date: Date): Observable<Appointment[]> {
    return this.appointments.pipe(
      map((appointments) => {
        return appointments.filter((appointment) => {
          return (
            appointment.date.getDate() === date.getDate() &&
            appointment.date.getMonth() === date.getMonth() &&
            appointment.date.getFullYear() === date.getFullYear()
          );
        });
      })
    );
  }

  addAppointment(appointment: Appointment): void {
    const currentAppointments = this.appointments.getValue();
    appointment.id = this.generateId();

    const updatedAppointments = [...currentAppointments, appointment];
    this.appointments.next(updatedAppointments);
    this.saveToLocalStorage(updatedAppointments);
  }

  updateAppointment(updatedAppointment: Appointment): void {
    const currentAppointments = this.appointments.getValue();
    const index = currentAppointments.findIndex(
      (a) => a.id === updatedAppointment.id
    );

    if (index !== -1) {
      const appointments = [...currentAppointments];
      appointments[index] = updatedAppointment;
      this.appointments.next(appointments);
      this.saveToLocalStorage(appointments);
    }
  }

  deleteAppointment(id: string): void {
    const currentAppointments = this.appointments.getValue();
    const updatedAppointments = currentAppointments.filter((a) => a.id !== id);
    this.appointments.next(updatedAppointments);
    this.saveToLocalStorage(updatedAppointments);
  }

  moveAppointment(appointmentId: string, newDate: Date): void {
    const currentAppointments = this.appointments.getValue();
    const appointmentIndex = currentAppointments.findIndex(
      (a) => a.id === appointmentId
    );

    if (appointmentIndex !== -1) {
      const appointments = [...currentAppointments];
      appointments[appointmentIndex] = {
        ...appointments[appointmentIndex],
        date: newDate,
      };
      this.appointments.next(appointments);
      this.saveToLocalStorage(appointments);
    }
  }

  moveAppointment1(event: CdkDragDrop<Appointment[]>): void {
    if (event.previousContainer === event.container) {
      // Reordering within the same day
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Moving to a different day
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorageTest__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  private generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private saveToLocalStorage(appointments: Appointment[]): void {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }
}
