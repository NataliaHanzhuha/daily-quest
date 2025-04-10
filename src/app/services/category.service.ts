import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VenueCategory } from '../models/task';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly url = environment.backendUrl + 'category/';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<VenueCategory[]> {
    return this.http.get<VenueCategory[]>(this.url);
  }

  getCategoryById(id: string): Observable<VenueCategory> {
    return this.http.get<VenueCategory>(`${this.url}${id}`);
  }

  createCategory(data: Omit<VenueCategory, 'id'>): Observable<any> {
    return this.http.post(this.url + 'new', data);
  }

  updateCategory(data: VenueCategory): Observable<any> {
    return this.http.put(`${this.url}update/${data.id}`, data);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.url}delete/${id}`);
  }
}
