import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventBooking } from '../../models/task';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { TimeService } from '../time.service';

@Injectable({providedIn: 'root'})
export class EventBookingService {
  private readonly url = environment.backendUrl + 'event-booking/';

  constructor(private http: HttpClient, private timeService: TimeService) {
  }

  getBookings(): Observable<EventBooking[]> {
    return this.http.get<EventBooking[]>(this.url)
      .pipe(map((events: EventBooking[]) => events.map((event: EventBooking) => {
        return {
          ...event,
          date: this.timeService.getDate(event.date),
          dateString: this.timeService.getDate(event.dateString),
          createdAt: this.timeService.getDate(event.createdAt, true),
        };
      })));
  }

  getBookingById(id: string): Observable<EventBooking> {
    return this.http.get<EventBooking>(`${this.url}${id}`);
  }

  createBooking(data: any): Observable<any> {
    return this.http.post(this.url + 'new', data);
  }

  updateBooking(data: EventBooking): Observable<any> {
    return this.http.put(`${this.url}update/${data.id}`, data);
  }

  updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Observable<any> {
    return this.http.put(`${this.url}update/status/${id}`, {status});
  }

  deleteBooking(id: string): Observable<any> {
    return this.http.delete(`${this.url}delete/${id}`);
  }

  updatePayment(paymentId: string, bookingId: string): Observable<any> {
    return this.http.put(`${this.url}payment-update/`, {paymentId, bookingId});
  }

  /** 🔍 Check if a booking exists */
  bookingExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}exist/${id}`);
  }

  /** 📅 Get bookings filtered for calendar view */
  filteredBookingForCalendar(from: string, to: string, venueId: string | null = null, statuses: string[] = []): Observable<EventBooking[]> {
    return this.http.post<EventBooking[]>(`${this.url}filter`, {from, to, venueId, statuses})
      .pipe(map((events: EventBooking[]) => events.map((event: EventBooking) => {
        return {
          ...event,
          date: this.timeService.getDate(event.date),
          dateString: this.timeService.getDate(event.dateString),
          createdAt: this.timeService.getDate(event.createdAt, true),
        };
      })));
  }

  /** 🕓 Check available booking slots */
  getAvailableSlots(
    venueId: string,
    dateString: string,
    startTime: number,
    endTime: number,
    duration: number, // in minutes
    paddingBeforeMinutes: number = 0,
    paddingAfterMinutes: number = 0,
  ): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.url}available`,
      {venueId, dateString, duration, startTime, endTime, paddingBeforeMinutes, paddingAfterMinutes});
  }

}
