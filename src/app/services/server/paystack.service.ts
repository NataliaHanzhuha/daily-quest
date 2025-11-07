import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class PaystackService {
  private readonly url = environment.backendUrl + 'paystack/';

  constructor(private http: HttpClient) {
  }

  initializePayment(email: string, amount: number, metadata: any = {}) {
    return this.http.post<{ authorization_url: string }>(
      this.url + 'init-payment',
      {email, amount, metadata}
    );
  }
}
