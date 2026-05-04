import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe, DatePipe],
  template: `
    <div class="max-w-6xl mx-auto p-6 font-sans relative">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-green-800">Blue Lagoon.</h1>
        <button
          (click)="toggleView()"
          class="px-4 py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-600 hover:bg-green-100 hover:text-green-700 transition"
        >
          {{ isAdminView() ? '← Back to Booking' : 'Admin Dashboard' }}
        </button>
      </div>

      @if (!isAdminView()) {
        <!-- BOOKING FORM SECTION -->
        @if (response()) {
          <div
            class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-in fade-in zoom-in flex justify-between items-center"
          >
            <div>
              <h2 class="text-green-700 font-bold flex items-center gap-2">
                ✅ Reservation Confirmed
              </h2>
              <p class="text-sm text-green-600 mt-1">
                Ref: {{ response().reservationReferenceNumber }}
              </p>
            </div>
            <button
              (click)="resetView()"
              class="text-xs bg-green-200 text-green-800 px-3 py-1 rounded-lg hover:bg-green-300"
            >
              New Booking
            </button>
          </div>
        }

        <div
          class="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-8"
          [class.opacity-50]="showConfirm()"
        >
          <form [formGroup]="bookingForm" class="space-y-6">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"
                >Customer Name</label
              >
              <input
                formControlName="customerName"
                type="text"
                class="w-full border-b border-gray-300 py-2 focus:border-green-600 outline-none transition"
                placeholder="Enter name"
              />
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"
                  >Check-in</label
                >
                <input
                  formControlName="checkInDate"
                  type="date"
                  [min]="today"
                  class="w-full border-b border-gray-300 py-2 focus:border-green-600 outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"
                  >Check-out</label
                >
                <input
                  formControlName="checkOutDate"
                  type="date"
                  [min]="bookingForm.get('checkInDate')?.value"
                  class="w-full border-b border-gray-300 py-2 focus:border-green-600 outline-none"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"
                  >Rooms</label
                >
                <input
                  formControlName="numberOfRooms"
                  type="number"
                  class="w-full border-b border-gray-300 py-2 focus:border-green-600 outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"
                  >Extra Beds</label
                >
                <input
                  formControlName="extraBeds"
                  type="number"
                  class="w-full border-b border-gray-300 py-2 focus:border-green-600 outline-none"
                />
              </div>
            </div>

            @if (estimatedTotal() > 0) {
              <div
                class="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 animate-in fade-in"
              >
                <p class="text-sm text-gray-500">Estimated Total Payable:</p>
                <p class="text-2xl font-bold text-gray-800">Ksh {{ estimatedTotal() | number }}</p>
              </div>
            }

            <button
              type="button"
              (click)="triggerConfirm()"
              [disabled]="bookingForm.invalid || estimatedTotal() <= 0 || !!response()"
              class="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-lg shadow-green-100"
            >
              Confirm Reservation
            </button>
          </form>
        </div>
      } @else {
        <!-- ADMIN TABLE SECTION -->
        <div
          class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
        >
          <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 class="text-lg font-bold text-gray-800">Internal Bookings Log</h2>
            <span
              class="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full uppercase"
              >Live Sync</span
            >
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-white text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                  <th class="px-6 py-4 border-b">Ref / Date Booked</th>
                  <th class="px-6 py-4 border-b">Guest</th>
                  <th class="px-6 py-4 border-b">Check In</th>
                  <th class="px-6 py-4 border-b text-center">Nights</th>
                  <th class="px-6 py-4 border-b text-right">Amount Billed</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                @for (item of allBookings(); track item.reservationReferenceNumber) {
                  <tr class="odd:bg-gray-50/50 hover:bg-green-50/30 transition-colors group">
                    <td class="px-6 py-4">
                      <div class="font-mono font-bold text-green-700">
                        {{ item.reservationReferenceNumber }}
                      </div>
                      <div class="text-[10px] text-gray-400">
                        {{ item.reservationTime | date: 'MMM d, h:mm a' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 font-semibold text-gray-800">
                      {{ item.customerName || 'Anonymous' }}
                    </td>
                    <td class="px-6 py-4 text-gray-600">
                      {{ item.checkInDate | date: 'mediumDate' }}
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span
                        class="bg-gray-200 group-hover:bg-green-200 text-gray-700 group-hover:text-green-800 px-2 py-1 rounded text-xs font-bold"
                      >
                        {{ calculateNights(item.checkInDate, item.checkOutDate) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right font-bold text-gray-900">
                      <!-- Updated to match Backend field name: totalAmountPayable -->
                      Ksh {{ item.totalAmountPayable | number }}
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="px-6 py-20 text-center text-gray-400 italic">
                      No reservations found in memory.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- CONFIRMATION MODAL -->
      @if (showConfirm()) {
        <div
          class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            class="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200"
          >
            <h3 class="text-xl font-bold text-gray-900 mb-2">Final Confirmation</h3>
            <p class="text-gray-500 text-sm mb-6">
              Verify booking for <strong>{{ bookingForm.value.customerName }}</strong
              >.
            </p>
            <div class="bg-gray-50 rounded-xl p-4 mb-6">
              <div class="text-3xl font-black text-green-700">
                Ksh {{ estimatedTotal() | number }}
              </div>
            </div>
            <div class="flex gap-3">
              <button
                (click)="showConfirm.set(false)"
                class="flex-1 py-3 font-bold text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
              <button
                (click)="submitBooking()"
                [disabled]="isLoading()"
                class="flex-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700"
              >
                {{ isLoading() ? 'Processing...' : 'Proceed' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class Reservations {
  private fb = inject(FormBuilder);
  private reservationService = inject(ReservationService);

  isAdminView = signal(false);
  isLoading = signal(false);
  showConfirm = signal(false);
  response = signal<any>(null);
  allBookings = signal<any[]>([]);
  errorMessage = signal('');
  today = new Date().toISOString().split('T')[0];

  bookingForm: FormGroup = this.fb.group({
    hotelName: ['Blue Lagoon Hotels & Resorts'],
    customerName: ['', [Validators.required, Validators.minLength(3)]],
    checkInDate: ['', Validators.required],
    checkOutDate: ['', Validators.required],
    numberOfRooms: [1, [Validators.required, Validators.min(1)]],
    extraBeds: [0, [Validators.required, Validators.min(0)]],
  });

  private formValue = toSignal(this.bookingForm.valueChanges, {
    initialValue: this.bookingForm.value,
  });

  estimatedTotal = computed(() => {
    const val = this.formValue();
    if (!val || !val.checkInDate || !val.checkOutDate) return 0;
    const nights = this.calculateNights(val.checkInDate, val.checkOutDate);
    if (nights <= 0) return 0;
    return 60000 * nights * (val.numberOfRooms || 1) + (val.extraBeds || 0) * 10000;
  });

  calculateNights(start: string, end: string): number {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }

  toggleView() {
    if (!this.isAdminView()) {
      this.fetchBookings();
    }
    this.isAdminView.update((v) => !v);
  }

  fetchBookings() {
    this.reservationService.getReservations().subscribe({
      next: (data: any) => this.allBookings.set(data),
      error: () => this.errorMessage.set('Could not load bookings.'),
    });
  }

  triggerConfirm() {
    this.showConfirm.set(true);
  }

  submitBooking() {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    const payload = { ...this.bookingForm.value, requestTime: new Date().toISOString() };

    this.reservationService.postReservation(payload).subscribe({
      next: (res) => {
        this.response.set(res);
        this.isLoading.set(false);
        this.showConfirm.set(false);
        this.bookingForm.reset({
          hotelName: 'Blue Lagoon Hotels & Resorts',
          numberOfRooms: 1,
          extraBeds: 0,
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.showConfirm.set(false);
        this.errorMessage.set('Server error.');
      },
    });
  }

  resetView() {
    this.response.set(null);
  }
}
