
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { catchError, finalize, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { ApiService } from '../../services/api.service';
import { MockPspSdkService } from '../../services/mock-psp-sdk.service';
import { ValidationService } from '../../services/validation.service';
import { CheckoutStatus, PaymentLinkWithPreviewResponse, ProcessPaymentResponse } from '../../models/payment.model';
import { FeeBreakdownComponent } from '../fee-breakdown/fee-breakdown.component';
import { PaymentStatusComponent } from '../payment-status/payment-status.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    CurrencyPipe,
    FeeBreakdownComponent,
    PaymentStatusComponent
  ]
})
export class CheckoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private mockSdkService = inject(MockPspSdkService);
  private validationService = inject(ValidationService);

  status = signal<CheckoutStatus>('INITIALIZING');
  paymentLink = signal<PaymentLinkWithPreviewResponse | null>(null);
  paymentResult = signal<ProcessPaymentResponse | null>(null);
  errorMessage = signal<string | null>(null);

  totalAmount = computed(() => {
    const link = this.paymentLink();
    if (!link) return 0;
    const total = Number(link.amountUsd) + Number(link.feePreview.totalFeesUsd);
    return Math.round(total * 100) / 100;
  });

  paymentForm = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(19), this.validationService.luhnValidator()]],
    expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\s?\/\s?([2-9][0-9])$/)]],
    cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4), Validators.pattern(/^\d+$/)]],
    cardHolder: ['Juan Pérez', [Validators.required, Validators.minLength(3)]]
  });
  
  searchControl = this.fb.control('', [Validators.required, Validators.minLength(5)]);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadLink(id);
      } else {
        this.status.set('AWAITING_INPUT');
      }
    });
  }

  loadLink(id: string): void {
    this.status.set('LOADING_LINK');
    this.apiService.getPaymentLink(id).pipe(
      catchError(() => {
        this.status.set('LINK_NOT_FOUND');
        this.searchControl.setValue(id);
        return of(null);
      })
    ).subscribe(data => {
      if (data) {
        this.paymentLink.set(data);
        this.status.set('READY_TO_PAY');
      }
    });
  }

  search(): void {
    if (this.searchControl.invalid) {
      this.searchControl.markAsTouched();
      return;
    }
    const linkId = this.searchControl.value?.trim();
    if (linkId) {
      this.router.navigate(['/links', linkId]);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.status.set('PROCESSING_PAYMENT');
    this.paymentForm.disable();
    this.errorMessage.set(null);

    try {
      const cardToken = await this.mockSdkService.createToken('STRIPE');
      const idempotencyKey = crypto.randomUUID();
      const id = this.paymentLink()?.id;
      if(!id) {
          throw new Error('Payment link ID is missing');
      }
      
      const { cardHolder } = this.paymentForm.getRawValue();

      this.apiService.processPayment(id, {
        cardToken,
        idempotencyKey,
        pspProvider: 'STRIPE',
        metadata: {
          cardHolder
        }
      }).pipe(
          catchError((error: HttpErrorResponse) => {
              const apiError = error.error;
              if (apiError && typeof apiError.message === 'string') {
                  this.errorMessage.set(apiError.message);
              } else {
                  this.errorMessage.set(`We couldn't process your payment at this time. Please try again.`);
              }
              this.status.set('ERROR_RETRYABLE');
              return of(null);
          }),
          finalize(() => this.paymentForm.enable())
      ).subscribe(response => {
        if(response) {
            this.paymentResult.set(response);
            if(response.status === 'COMPLETED') {
                this.status.set('COMPLETED');
            } else {
                this.status.set('FAILED');
            }
        }
      });

    } catch (error) {
      this.errorMessage.set('An unexpected error occurred while preparing the payment. Please try again.');
      this.status.set('ERROR_RETRYABLE');
      this.paymentForm.enable();
    }
  }
  
  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substring(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    this.paymentForm.controls.cardNumber.setValue(value, { emitEvent: false });
  }

  formatExpiryDate(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substring(0, 4);
    if (value.length > 2) {
      value = `${value.substring(0, 2)} / ${value.substring(2)}`;
    }
    this.paymentForm.controls.expiryDate.setValue(value, { emitEvent: false });
  }

  retry() {
    this.status.set('READY_TO_PAY');
    this.paymentResult.set(null);
    this.errorMessage.set(null);
  }
}
