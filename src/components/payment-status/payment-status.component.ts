
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProcessPaymentResponse } from '../../models/payment.model';

/**
 * Component that displays the payment processing result to the user.
 *
 * This component shows either a success or failure message after a payment
 * has been processed, along with relevant payment details such as transaction ID,
 * amount, and fees.
 *
 * @example
 * ```typescript
 * // In parent component template
 * <app-payment-status
 *   [status]="'COMPLETED'"
 *   [result]="paymentResponse"
 * />
 * ```
 *
 * @example
 * ```typescript
 * // Programmatic usage
 * const paymentResult: ProcessPaymentResponse = {
 *   id: 'pay_123',
 *   status: 'COMPLETED',
 *   amountUsd: 100.00,
 *   totalFeesUsd: 3.50
 * };
 *
 * <app-payment-status
 *   [status]="'COMPLETED'"
 *   [result]="paymentResult"
 * />
 * ```
 */
@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CurrencyPipe]
})
export class PaymentStatusComponent {
  /**
   * The final status of the payment transaction.
   * Determines which UI state to display (success or error).
   */
  status = input.required<'COMPLETED' | 'FAILED'>();

  /**
   * The complete payment response object containing transaction details.
   * Contains information such as payment ID, amounts, and timestamps.
   */
  result = input.required<ProcessPaymentResponse | null>();
}
