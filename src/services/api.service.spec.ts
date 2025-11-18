import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { PaymentLinkWithPreviewResponse, ProcessPaymentRequest, ProcessPaymentResponse } from '../models/payment.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpTesting: HttpTestingController;
  const baseUrl = 'https://kira-payment-api.onrender.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('getPaymentLink', () => {
    it('should retrieve payment link by id', () => {
      const mockResponse: PaymentLinkWithPreviewResponse = {
        id: 'link123',
        merchantId: 'merchant123',
        status: 'ACTIVE',
        amountUsd: 100,
        description: 'Test payment',
        expiresAt: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        checkoutUrl: 'https://example.com/checkout/link123',
        feePreview: {
          fxRate: 20.5,
          totalFeesUsd: 5.50,
          recipientAmountMxn: 2050,
          breakdown: {
            fixedFeeUsd: 2.00,
            variableFeeUsd: 2.50,
            fxMarkupUsd: 1.00,
            firstTxDiscountUsd: 0,
          },
        },
      };

      service.getPaymentLink('link123').subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTesting.expectOne(`${baseUrl}/payment-links/link123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle different payment link ids', () => {
      const testIds = ['abc123', 'xyz789', 'test-id-001'];

      testIds.forEach((id) => {
        service.getPaymentLink(id).subscribe();
        const req = httpTesting.expectOne(`${baseUrl}/payment-links/${id}`);
        expect(req.request.method).toBe('GET');
        req.flush({});
      });
    });
  });

  describe('processPayment', () => {
    it('should process payment with correct request', () => {
      const paymentRequest: ProcessPaymentRequest = {
        cardToken: 'tok_test_123',
        pspProvider: 'STRIPE',
        idempotencyKey: 'key123',
        metadata: { userId: 'user123' },
      };

      const mockResponse: ProcessPaymentResponse = {
        transactionId: 'txn123',
        status: 'COMPLETED',
        paymentLinkId: 'link123',
        pspProvider: 'STRIPE',
        amountUsd: 100,
        recipientAmountMxn: 2050,
        fxRateApplied: 20.5,
        totalFeesUsd: 5.50,
      };

      service.processPayment('link123', paymentRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTesting.expectOne(`${baseUrl}/payment-links/link123/payments`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(paymentRequest);
      req.flush(mockResponse);
    });

    it('should handle ADYEN provider', () => {
      const paymentRequest: ProcessPaymentRequest = {
        cardToken: 'tok_adyen_123',
        pspProvider: 'ADYEN',
        idempotencyKey: 'key456',
      };

      service.processPayment('link456', paymentRequest).subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/payment-links/link456/payments`);
      expect(req.request.body.pspProvider).toBe('ADYEN');
      req.flush({});
    });

    it('should handle failed payment status', () => {
      const paymentRequest: ProcessPaymentRequest = {
        cardToken: 'tok_fail_123',
        pspProvider: 'STRIPE',
        idempotencyKey: 'key789',
      };

      const mockResponse: ProcessPaymentResponse = {
        transactionId: 'txn456',
        status: 'FAILED',
        paymentLinkId: 'link789',
        pspProvider: 'STRIPE',
        amountUsd: 100,
        recipientAmountMxn: 0,
        fxRateApplied: 20.5,
        totalFeesUsd: 0,
      };

      service.processPayment('link789', paymentRequest).subscribe((response) => {
        expect(response.status).toBe('FAILED');
      });

      const req = httpTesting.expectOne(`${baseUrl}/payment-links/link789/payments`);
      req.flush(mockResponse);
    });
  });
});
