import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UploadImageService {
  private readonly url = environment.backendUrl + 'upload-image/';

  constructor(private http: HttpClient) {
  }

  uploadImage(file: any, path: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('pathname', path); // 🆕 send to control path

    return this.http.post<{ imageUrl: string }>(this.url, formData);
  }
}
