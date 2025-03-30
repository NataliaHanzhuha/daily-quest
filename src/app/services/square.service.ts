import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SquarePaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SquareService {
  private apiUrl = 'https://connect.squareup.com/v2';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${environment.squareAccessToken}`,
    'Square-Version': '2025-02-20'
  });

  constructor(private http: HttpClient) {}

  /**
   * Process a payment using Square Payment API
   * In a real implementation, you would use Square's Web Payments SDK for client-side tokenization
   * and then send the token to your backend to process the payment
   */
  processPayment(amount: number, currency: string, description: string): Observable<SquarePaymentResult> {
    // For demo purposes, we're simulating a successful payment
    // In a real app, you would first get a nonce from Square's Web Payment SDK
    // Then send the nonce to your server to create a payment

    // Simulating a payment for demonstration
    if (environment.production) {
      // In production, we would actually call Square API
      return this.createPayment(amount, currency, description, 'demo-nonce-placeholder');
    } else {
      // In development, just simulate a successful payment after a delay
      return of({
        success: true,
        paymentId: `sq_${Math.random().toString(36).substring(2, 15)}`
      });
    }
  }

  /**
   * Create a payment with Square API
   * This would typically be done on your backend for security reasons
   */
  private createPayment(amount: number, currency: string, description: string, sourceId: string): Observable<SquarePaymentResult> {
    const payload = {
      source_id: sourceId,
      idempotency_key: this.generateIdempotencyKey(),
      amount_money: {
        amount: amount * 100, // Square uses smallest currency unit (cents)
        currency: currency
      },
      note: description
    };

    return this.http.post<any>(`${this.apiUrl}/payments`, payload, { headers: this.headers })
      .pipe(
        map(response => ({
          success: true,
          paymentId: response.payment.id
        })),
        catchError(error => {
          console.error('Square payment error:', error);
          return of({
            success: false,
            error: error.error?.errors?.[0]?.detail || 'Failed to process payment'
          });
        })
      );
  }

  /**
   * Get a list of payment methods for a customer
   * This would be used to display saved payment methods
   */
  getCustomerPaymentMethods(customerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/customers/${customerId}/payment-methods`, { headers: this.headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching payment methods:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Generate an idempotency key for Square API requests
   * This ensures that the same request is not processed twice
   */
  private generateIdempotencyKey(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}
