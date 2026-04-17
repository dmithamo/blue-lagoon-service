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

  // Get today's date formatted as YYYY-MM-DD for the HTML 'min' attribute
  today = new Date().toISOString().split('T')[0];

  booking = {
    hotelName: 'Blue Lagoon Hotels & Resorts',
    customerName: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfRooms: 1,
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
        const msg = err.error?.message || 'Connection failed.';
        this.errorMessage.set(msg);
      }
    });
  }
}
