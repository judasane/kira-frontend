
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FeePreview } from '../../models/payment.model';

/**
 * Component that displays a collapsible breakdown of payment fees.
 *
 * Shows detailed information about processing fees, platform fees, and total fees
 * in an expandable/collapsible panel. Helps users understand the cost structure
 * of their payment.
 *
 * @example
 * ```typescript
 * // In parent component template
 * <app-fee-breakdown
 *   [feePreview]="paymentLink().feePreview"
 *   [baseAmount]="paymentLink().amountUsd"
 * />
 * ```
 *
 * @example
 * ```typescript
 * // With specific fee data
 * const feePreview: FeePreview = {
 *   processingFeeUsd: 2.50,
 *   platformFeeUsd: 1.00,
 *   totalFeesUsd: 3.50
 * };
 *
 * <app-fee-breakdown
 *   [feePreview]="feePreview"
 *   [baseAmount]="100.00"
 * />
 * ```
 */
@Component({
  selector: 'app-fee-breakdown',
  templateUrl: './fee-breakdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CurrencyPipe]
})
export class FeeBreakdownComponent {
  /**
   * Fee preview data containing all fee amounts.
   * Includes processing fees, platform fees, and total.
   */
  feePreview = input.required<FeePreview>();

  /**
   * Base payment amount before fees.
   * Used to display the original transaction amount.
   */
  baseAmount = input.required<number>();

  /**
   * Signal controlling the expanded/collapsed state of the breakdown.
   * Defaults to collapsed (false).
   */
  isOpen = signal(false);

  /**
   * Toggles the visibility of the fee breakdown details.
   *
   * Switches between expanded and collapsed states, allowing users
   * to view or hide detailed fee information.
   *
   * @example
   * ```typescript
   * // In template
   * <button (click)="toggle()">
   *   {{ isOpen() ? 'Hide' : 'Show' }} Fee Details
   * </button>
   * ```
   */
  toggle() {
    this.isOpen.update(open => !open);
  }
}
