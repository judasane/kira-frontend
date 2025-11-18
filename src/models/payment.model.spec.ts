import { describe, it, expect } from 'vitest';
import type {
  FeePreview,
  PaymentLinkResponse,
  PaymentLinkWithPreviewResponse,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  CheckoutStatus,
} from './payment.model';

describe('Payment Models', () => {
  describe('FeePreview', () => {
    it('should create a valid FeePreview object', () => {
      const feePreview: FeePreview = {
        fxRate: 20.5,
        totalFeesUsd: 5.50,
        recipientAmountMxn: 2050,
        breakdown: {
          fixedFeeUsd: 2.00,
          variableFeeUsd: 2.50,
          fxMarkupUsd: 1.00,
          firstTxDiscountUsd: 0,
        },
      };

      expect(feePreview.fxRate).toBe(20.5);
      expect(feePreview.totalFeesUsd).toBe(5.50);
      expect(feePreview.recipientAmountMxn).toBe(2050);
      expect(feePreview.breakdown.fixedFeeUsd).toBe(2.00);
    });
  });

  describe('PaymentLinkResponse', () => {
    it('should create a valid PaymentLinkResponse object', () => {
      const paymentLink: PaymentLinkResponse = {
        id: 'link123',
        merchantId: 'merchant123',
        status: 'ACTIVE',
        amountUsd: 100,
        description: 'Test payment',
        expiresAt: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        checkoutUrl: 'https://example.com/checkout/link123',
      };

      expect(paymentLink.id).toBe('link123');
      expect(paymentLink.status).toBe('ACTIVE');
    });

    it('should accept all valid status values', () => {
      const statuses: PaymentLinkResponse['status'][] = [
        'DRAFT',
        'ACTIVE',
        'EXPIRED',
        'COMPLETED',
        'CANCELLED',
      ];

      statuses.forEach((status) => {
        const link: PaymentLinkResponse = {
          id: 'test',
          merchantId: 'merchant',
          status,
          amountUsd: 100,
          description: 'Test',
          expiresAt: null,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          checkoutUrl: 'https://example.com',
        };
        expect(link.status).toBe(status);
      });
    });
  });

  describe('PaymentLinkWithPreviewResponse', () => {
    it('should extend PaymentLinkResponse with feePreview', () => {
      const paymentLinkWithPreview: PaymentLinkWithPreviewResponse = {
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

      expect(paymentLinkWithPreview.feePreview).toBeDefined();
      expect(paymentLinkWithPreview.feePreview.fxRate).toBe(20.5);
    });
  });

  describe('ProcessPaymentRequest', () => {
    it('should create a valid ProcessPaymentRequest with STRIPE', () => {
      const request: ProcessPaymentRequest = {
        cardToken: 'tok_stripe_123',
        pspProvider: 'STRIPE',
        idempotencyKey: 'key123',
        metadata: { userId: 'user123' },
      };

      expect(request.pspProvider).toBe('STRIPE');
      expect(request.cardToken).toBe('tok_stripe_123');
    });

    it('should create a valid ProcessPaymentRequest with ADYEN', () => {
      const request: ProcessPaymentRequest = {
        cardToken: 'tok_adyen_123',
        pspProvider: 'ADYEN',
        idempotencyKey: 'key456',
      };

      expect(request.pspProvider).toBe('ADYEN');
      expect(request.metadata).toBeUndefined();
    });
  });

  describe('ProcessPaymentResponse', () => {
    it('should create a valid completed payment response', () => {
      const response: ProcessPaymentResponse = {
        transactionId: 'txn123',
        status: 'COMPLETED',
        paymentLinkId: 'link123',
        pspProvider: 'STRIPE',
        amountUsd: 100,
        recipientAmountMxn: 2050,
        fxRateApplied: 20.5,
        totalFeesUsd: 5.50,
      };

      expect(response.status).toBe('COMPLETED');
      expect(response.transactionId).toBe('txn123');
    });

    it('should create a valid failed payment response', () => {
      const response: ProcessPaymentResponse = {
        transactionId: 'txn456',
        status: 'FAILED',
        paymentLinkId: 'link456',
        pspProvider: 'ADYEN',
        amountUsd: 100,
        recipientAmountMxn: 0,
        fxRateApplied: 20.5,
        totalFeesUsd: 0,
      };

      expect(response.status).toBe('FAILED');
    });
  });

  describe('CheckoutStatus', () => {
    it('should accept all valid checkout status values', () => {
      const statuses: CheckoutStatus[] = [
        'INITIALIZING',
        'AWAITING_INPUT',
        'LOADING_LINK',
        'LINK_NOT_FOUND',
        'READY_TO_PAY',
        'PROCESSING_PAYMENT',
        'COMPLETED',
        'FAILED',
        'ERROR_RETRYABLE',
      ];

      statuses.forEach((status) => {
        const currentStatus: CheckoutStatus = status;
        expect(currentStatus).toBe(status);
      });
    });
  });
});
