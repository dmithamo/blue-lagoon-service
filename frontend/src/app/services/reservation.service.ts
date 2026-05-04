import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core'; // Fixed import
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Create a new reservation
  postReservation(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Fetch all reservations
  getReservations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
