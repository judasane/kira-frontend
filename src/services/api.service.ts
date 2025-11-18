import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentLinkWithPreviewResponse, ProcessPaymentRequest, ProcessPaymentResponse } from '../models/payment.model';

/**
 * Service that handles all HTTP communication with the Kira Payment API.
 *
 * This service provides methods to interact with payment links and process
 * payments through the backend API. It encapsulates all API endpoints and
 * handles request/response formatting.
 *
 * @example
 * ```typescript
 * const apiService = inject(ApiService);
 *
 * // Get payment link details
 * apiService.getPaymentLink('pl_abc123xyz').subscribe(link => {
 *   console.log('Amount:', link.amountUsd);
 *   console.log('Fees:', link.feePreview.totalFeesUsd);
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Process a payment
 * const request: ProcessPaymentRequest = {
 *   cardToken: 'tok_stripe_abc123',
 *   idempotencyKey: 'unique-key-123',
 *   pspProvider: 'STRIPE',
 *   metadata: { cardHolder: 'John Doe' }
 * };
 *
 * apiService.processPayment('pl_abc123xyz', request).subscribe(
 *   response => console.log('Payment completed:', response.id),
 *   error => console.error('Payment failed:', error)
 * );
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://kira-payment-api.onrender.com';

  /**
   * Retrieves payment link details with fee preview.
   *
   * Fetches complete information about a payment link including the amount,
   * merchant details, and calculated fee breakdown.
   *
   * @param id - The unique identifier of the payment link
   * @returns Observable that emits the payment link data with fee preview
   *
   * @example
   * ```typescript
   * this.apiService.getPaymentLink('pl_abc123xyz').pipe(
   *   catchError(error => {
   *     console.error('Payment link not found');
   *     return of(null);
   *   })
   * ).subscribe(link => {
   *   if (link) {
   *     console.log('Payment link loaded:', link.id);
   *   }
   * });
   * ```
   */
  getPaymentLink(id: string): Observable<PaymentLinkWithPreviewResponse> {
    return this.http.get<PaymentLinkWithPreviewResponse>(`${this.baseUrl}/payment-links/${id}`);
  }

  /**
   * Processes a payment for a specific payment link.
   *
   * Submits payment information including the tokenized card data,
   * idempotency key, and PSP provider to process the transaction.
   *
   * @param id - The unique identifier of the payment link
   * @param request - The payment processing request containing card token and metadata
   * @returns Observable that emits the payment processing result
   *
   * @example
   * ```typescript
   * const paymentRequest: ProcessPaymentRequest = {
   *   cardToken: 'tok_stripe_abc123',
   *   idempotencyKey: crypto.randomUUID(),
   *   pspProvider: 'STRIPE',
   *   metadata: {
   *     cardHolder: 'Jane Smith',
   *     billingAddress: '123 Main St'
   *   }
   * };
   *
   * this.apiService.processPayment('pl_abc123xyz', paymentRequest).subscribe({
   *   next: (response) => {
   *     if (response.status === 'COMPLETED') {
   *       console.log('Payment successful!', response.id);
   *     }
   *   },
   *   error: (err) => console.error('Payment error:', err.message)
   * });
   * ```
   */
  processPayment(id: string, request: ProcessPaymentRequest): Observable<ProcessPaymentResponse> {
    return this.http.post<ProcessPaymentResponse>(`${this.baseUrl}/payment-links/${id}/payments`, request);
  }
}