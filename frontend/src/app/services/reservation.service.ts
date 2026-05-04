import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/reservations';

  postReservation(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  getReservations() {
    return this.http.get(`${this.apiUrl}`);
  }
}
