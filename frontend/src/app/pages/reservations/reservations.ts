import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.html',
})
export class Reservations {
  private reservationService = inject(ReservationService);
  
  isLoading = signal(false);
  response = signal<any>(null);
  errorMessage = signal('');
  today = new Date().toISOString().split('T')[0];

  booking = {
    hotelName: 'Blue Lagoon Hotels & Resorts',
    customerName: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfRooms: 1,
    extraBeds: 0,
    requestTime: new Date().toISOString()
  };

  submitBooking() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.response.set(null);

    this.reservationService.postReservation(this.booking).subscribe({
      next: (res) => {
        this.response.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Server connection failed.');
      }
    });
  }
}
