import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkSchedule } from '../models/task';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WorkScheduleService {
  private readonly url = environment.backendUrl + 'schedule/';

  constructor(private http: HttpClient) {}

  getSchedules(): Observable<WorkSchedule[]> {
    return this.http.get<WorkSchedule[]>(this.url);
  }

  getScheduleById(id: string): Observable<WorkSchedule> {
    return this.http.get<WorkSchedule>(`${this.url}/${id}`);
  }

  createSchedule(data: WorkSchedule): Observable<any> {
    return this.http.post(this.url + 'new', data);
  }

  updateSchedule(data: WorkSchedule): Observable<any> {
    return this.http.put(`${this.url}update/${data.id}`, data);
  }

  deleteSchedule(id: string): Observable<any> {
    return this.http.delete(`${this.url}delete/${id}`);
  }
}
