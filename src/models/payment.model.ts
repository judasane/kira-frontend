export interface FeePreview {
  fxRate: number;
  totalFeesUsd: number;
  recipientAmountMxn: number;
  breakdown: {
    fixedFeeUsd: number;
    variableFeeUsd: number;
    fxMarkupUsd: number;
    firstTxDiscountUsd: number;
  };
}

export interface PaymentLinkResponse {
  id: string;
  merchantId: string;
  status: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'COMPLETED' | 'CANCELLED';
  amountUsd: number;
  description: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  checkoutUrl: string;
}

export interface PaymentLinkWithPreviewResponse extends PaymentLinkResponse {
  feePreview: FeePreview;
}

export interface ProcessPaymentRequest {
  cardToken: string;
  pspProvider: 'STRIPE' | 'ADYEN';
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}

export interface ProcessPaymentResponse {
  transactionId: string;
  status: 'COMPLETED' | 'FAILED';
  paymentLinkId: string;
  pspProvider: 'STRIPE' | 'ADYEN';
  amountUsd: number;
  recipientAmountMxn: number;
  fxRateApplied: number;
  totalFeesUsd: number;
}

export type CheckoutStatus =
  | 'INITIALIZING'
  | 'AWAITING_INPUT'
  | 'LOADING_LINK'
  | 'LINK_NOT_FOUND'
  | 'READY_TO_PAY'
  | 'PROCESSING_PAYMENT'
  | 'COMPLETED'
  | 'FAILED'
  | 'ERROR_RETRYABLE';