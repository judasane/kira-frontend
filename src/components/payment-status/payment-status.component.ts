
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProcessPaymentResponse } from '../../models/payment.model';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CurrencyPipe]
})
export class PaymentStatusComponent {
  status = input.required<'COMPLETED' | 'FAILED'>();
  result = input.required<ProcessPaymentResponse | null>();
}
