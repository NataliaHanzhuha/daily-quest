import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venue } from '../../models/task';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class VenueService {
  private readonly url = environment.backendUrl + 'venue/';

  constructor(private http: HttpClient) {
  }

  getVenues(): Observable<Venue[]> {
    return this.http.get<Venue[]>(this.url);
  }

  getVenueById(id: string): Observable<Venue> {
    return this.http.get<Venue>(`${this.url}${id}`);
  }

  getVenueByFilter(categoryId: string): Observable<any> {
    return this.http.post(this.url + 'filter', {categoryId});
  }

  createVenue(data: Venue): Observable<any> {
    return this.http.post(this.url + 'new', data);
  }

  updateVenue(data: Venue): Observable<any> {
    return this.http.put(`${this.url}update/${data.id}`, data);
  }

  deleteVenue(id: string): Observable<any> {
    return this.http.delete(`${this.url}delete/${id}`);
  }
}
