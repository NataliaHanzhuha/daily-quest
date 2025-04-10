import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventBooking } from '../models/task';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventBookingService {
  private readonly url = environment.backendUrl + 'event-booking/';

  constructor(private http: HttpClient) {}

  getBookings(): Observable<EventBooking[]> {
    return this.http.get<EventBooking[]>(this.url);
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

  deleteBooking(id: string): Observable<any> {
    return this.http.delete(`${this.url}delete/${id}`);
  }

  /** 🔍 Check if a booking exists */
  bookingExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}exist/${id}`);
  }

  /** 📅 Get bookings filtered for calendar view */
  filteredBookingForCalendar(from: string, to: string): Observable<EventBooking[]> {
    return this.http.post<EventBooking[]>(`${this.url}filter`, {from, to});
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
