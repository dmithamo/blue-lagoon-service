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
    <div class="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div class="max-w-6xl mx-auto p-6 font-sans relative">
        <!-- HEADER -->
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-green-800 dark:text-green-500">Blue Lagoon.</h1>
          <button
            (click)="toggleView()"
            class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 transition"
          >
            {{ isAdminView() ? '← Back to Booking' : 'Admin Dashboard' }}
          </button>
        </div>

        @if (!isAdminView()) {
          <!-- BOOKING FORM SECTION -->
          @if (response()) {
            <div
              class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-in fade-in zoom-in flex justify-between items-center"
            >
              <div>
                <h2 class="text-green-700 dark:text-green-400 font-bold flex items-center gap-2">
                  ✅ Reservation Confirmed
                </h2>
                <p class="text-sm text-green-600 dark:text-green-500 mt-1">
                  Ref: {{ response().reservationReferenceNumber }}
                </p>
              </div>
              <button
                (click)="resetView()"
                class="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-3 py-1 rounded-lg hover:bg-green-300 dark:hover:bg-green-700"
              >
                New Booking
              </button>
            </div>
          }

          <div
            class="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm dark:shadow-2xl p-8 transition-colors"
            [class.opacity-50]="showConfirm()"
          >
            <form [formGroup]="bookingForm" class="space-y-6">
              <div>
                <label
                  class="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2"
                  >Customer Name</label
                >
                <input
                  formControlName="customerName"
                  type="text"
                  class="w-full bg-transparent border-b border-gray-300 dark:border-zinc-700 py-2 focus:border-green-600 dark:focus:border-green-500 text-gray-900 dark:text-zinc-100 outline-none transition"
                  placeholder="Enter name"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    class="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2"
                    >Check-in</label
                  >
                  <input
                    formControlName="checkInDate"
                    type="date"
                    [min]="today"
                    class="w-full bg-transparent border-b border-gray-300 dark:border-zinc-700 py-2 focus:border-green-600 dark:focus:border-green-500 text-gray-900 dark:text-zinc-100 outline-none color-scheme-dark"
                  />
                </div>
                <div>
                  <label
                    class="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2"
                    >Check-out</label
                  >
                  <input
                    formControlName="checkOutDate"
                    type="date"
                    [min]="bookingForm.get('checkInDate')?.value"
                    class="w-full bg-transparent border-b border-gray-300 dark:border-zinc-700 py-2 focus:border-green-600 dark:focus:border-green-500 text-gray-900 dark:text-zinc-100 outline-none"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label
                    class="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2"
                    >Rooms</label
                  >
                  <input
                    formControlName="numberOfRooms"
                    type="number"
                    class="w-full bg-transparent border-b border-gray-300 dark:border-zinc-700 py-2 focus:border-green-600 dark:focus:border-green-500 text-gray-900 dark:text-zinc-100 outline-none"
                  />
                </div>
                <div>
                  <label
                    class="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2"
                    >Extra Beds</label
                  >
                  <input
                    formControlName="extraBeds"
                    type="number"
                    class="w-full bg-transparent border-b border-gray-300 dark:border-zinc-700 py-2 focus:border-green-600 dark:focus:border-green-500 text-gray-900 dark:text-zinc-100 outline-none"
                  />
                </div>
              </div>

              @if (estimatedTotal() > 0) {
                <div
                  class="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700 animate-in fade-in"
                >
                  <p class="text-sm text-gray-500 dark:text-zinc-400">Estimated Total Payable:</p>
                  <p class="text-2xl font-bold text-gray-800 dark:text-zinc-100">
                    Ksh {{ estimatedTotal() | number }}
                  </p>
                </div>
              }

              <button
                type="button"
                (click)="triggerConfirm()"
                [disabled]="bookingForm.invalid || estimatedTotal() <= 0 || !!response()"
                class="w-full bg-green-600 dark:bg-green-700 text-white py-4 rounded-xl font-bold hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 dark:disabled:text-zinc-600 transition-all shadow-lg shadow-green-100 dark:shadow-none"
              >
                Confirm Reservation
              </button>
            </form>
          </div>
        } @else {
          <!-- ADMIN TABLE SECTION -->
          <div
            class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
          >
            <div
              class="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30 flex justify-between items-center"
            >
              <h2 class="text-lg font-bold text-gray-800 dark:text-zinc-100">
                Internal Bookings Log
              </h2>
              <span
                class="text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full uppercase"
                >Live Sync</span
              >
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr
                    class="bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold"
                  >
                    <th class="px-6 py-4 border-b dark:border-zinc-800">Ref / Date Booked</th>
                    <th class="px-6 py-4 border-b dark:border-zinc-800">Guest</th>
                    <th class="px-6 py-4 border-b dark:border-zinc-800">Check In</th>
                    <th class="px-6 py-4 border-b dark:border-zinc-800 text-center">Nights</th>
                    <th class="px-6 py-4 border-b dark:border-zinc-800 text-right">
                      Amount Billed
                    </th>
                  </tr>
                </thead>
                <tbody class="text-sm">
                  @for (item of allBookings(); track item.reservationReferenceNumber) {
                    <tr
                      class="odd:bg-gray-50/50 dark:odd:bg-zinc-800/20 hover:bg-green-50/30 dark:hover:bg-green-900/10 transition-colors group"
                    >
                      <td class="px-6 py-4">
                        <div class="font-mono font-bold text-green-700 dark:text-green-500">
                          {{ item.reservationReferenceNumber }}
                        </div>
                        <div class="text-[10px] text-gray-400 dark:text-zinc-500">
                          {{ item.reservationTime | date: 'MMM d, h:mm a' }}
                        </div>
                      </td>
                      <td class="px-6 py-4 font-semibold text-gray-800 dark:text-zinc-200">
                        {{ item.customerName || 'Anonymous' }}
                      </td>
                      <td class="px-6 py-4 text-gray-600 dark:text-zinc-400">
                        {{ item.checkInDate | date: 'mediumDate' }}
                      </td>
                      <td class="px-6 py-4 text-center">
                        <span
                          class="bg-gray-200 dark:bg-zinc-700 group-hover:bg-green-200 dark:group-hover:bg-green-800 text-gray-700 dark:text-zinc-300 group-hover:text-green-800 dark:group-hover:text-green-200 px-2 py-1 rounded text-xs font-bold"
                        >
                          {{ calculateNights(item.checkInDate, item.checkOutDate) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-right font-bold text-gray-900 dark:text-zinc-100">
                        Ksh {{ item.totalAmountPayable | number }}
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td
                        colspan="5"
                        class="px-6 py-20 text-center text-gray-400 dark:text-zinc-600 italic"
                      >
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
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div
              class="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 border dark:border-zinc-800"
            >
              <h3 class="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
                Final Confirmation
              </h3>
              <p class="text-gray-500 dark:text-zinc-400 text-sm mb-6">
                Verify booking for <strong>{{ bookingForm.value.customerName }}</strong
                >.
              </p>
              <div class="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 mb-6">
                <div class="text-3xl font-black text-green-700 dark:text-green-500">
                  Ksh {{ estimatedTotal() | number }}
                </div>
              </div>
              <div class="flex gap-3">
                <button
                  (click)="showConfirm.set(false)"
                  class="flex-1 py-3 font-bold text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  (click)="submitBooking()"
                  [disabled]="isLoading()"
                  class="flex-2 bg-green-600 dark:bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 dark:hover:bg-green-600"
                >
                  {{ isLoading() ? 'Processing...' : 'Proceed' }}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      /* Ensures date picker icon looks okay in dark mode for some browsers */
      .color-scheme-dark {
        color-scheme: dark;
      }
    `,
  ],
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
