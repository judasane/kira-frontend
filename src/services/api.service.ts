import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentLinkWithPreviewResponse, ProcessPaymentRequest, ProcessPaymentResponse } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://kira-payment-api.onrender.com'; 

  getPaymentLink(id: string): Observable<PaymentLinkWithPreviewResponse> {
    return this.http.get<PaymentLinkWithPreviewResponse>(`${this.baseUrl}/payment-links/${id}`);
  }

  processPayment(id: string, request: ProcessPaymentRequest): Observable<ProcessPaymentResponse> {
    return this.http.post<ProcessPaymentResponse>(`${this.baseUrl}/payment-links/${id}/payments`, request);
  }
}