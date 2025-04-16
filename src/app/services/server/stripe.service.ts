import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StripeFactoryService } from 'ngx-stripe';
import { environment } from '../../../environments/environment';
import { Customer } from '../../models/task';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  // private url: string = 'http://localhost:4242/api/';
  private readonly url: string = environment.backendUrl;

  stripe;

  constructor(private http: HttpClient,
              private factoryService: StripeFactoryService,) {
    this.stripe = this.factoryService.create(environment.stripe.publicKey);
  }

  getClientSecret(customer: Customer, description: any): Observable<any> {
    return this.http.post(this.url + 'create-payment-intent', {customer, description});
  }

  getPaymentById(id: string): Observable<any> {
    return this.http.get(this.url + 'payment-intent/' + id);
  }

  openStripeCheckout() {
   return this.http.post<{ id: string }>(this.url + "create-checkout-session", {})
      // .subscribe(async response => {
      //   this.stripe.redirectToCheckout({sessionId: response.id});
      // }, error => {
      //   console.error("Error creating Stripe session:", error);
      // });
  }

  sendInvoice() {
    return this.http.post(this.url + 'send-invoice', {items: []});
  }

}
