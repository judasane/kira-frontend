
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FeePreview } from '../../models/payment.model';

@Component({
  selector: 'app-fee-breakdown',
  templateUrl: './fee-breakdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CurrencyPipe]
})
export class FeeBreakdownComponent {
  feePreview = input.required<FeePreview>();
  baseAmount = input.required<number>();

  isOpen = signal(false);

  toggle() {
    this.isOpen.update(open => !open);
  }
}
