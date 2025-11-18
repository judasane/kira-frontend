
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

/**
 * Main checkout component that handles the complete payment flow.
 *
 * This component manages the entire checkout process including:
 * - Loading payment link details
 * - Displaying payment information and fee breakdown
 * - Collecting and validating card information
 * - Processing payments through PSP providers
 * - Showing payment results (success or failure)
 *
 * The component uses signals for reactive state management and includes
 * comprehensive error handling and validation.
 *
 * @example
 * ```typescript
 * // Used in routing configuration
 * {
 *   path: 'links/:id',
 *   component: CheckoutComponent
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Navigate to checkout with payment link ID
 * const router = inject(Router);
 * router.navigate(['/links', 'pl_abc123xyz']);
 * ```
 *
 * @example
 * ```typescript
 * // Component lifecycle
 * // 1. OnInit: Loads payment link from route params
 * // 2. User fills payment form
 * // 3. onSubmit(): Validates, tokenizes card, processes payment
 * // 4. Shows success/failure status
 * ```
 */
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

  /**
   * Current state of the checkout flow.
   * Controls which UI is displayed to the user.
   */
  status = signal<CheckoutStatus>('INITIALIZING');

  /**
   * The loaded payment link with preview information.
   * Contains payment amount, fees, and merchant details.
   */
  paymentLink = signal<PaymentLinkWithPreviewResponse | null>(null);

  /**
   * Result of the payment processing attempt.
   * Populated after payment submission completes.
   */
  paymentResult = signal<ProcessPaymentResponse | null>(null);

  /**
   * Error message to display to the user when payment fails.
   * Used for user-friendly error communication.
   */
  errorMessage = signal<string | null>(null);

  /**
   * Computed total amount including base amount and all fees.
   * Automatically recalculates when payment link changes.
   */
  totalAmount = computed(() => {
    const link = this.paymentLink();
    if (!link) return 0;
    const total = Number(link.amountUsd) + Number(link.feePreview.totalFeesUsd);
    return Math.round(total * 100) / 100;
  });

  /**
   * Reactive form for collecting payment card information.
   * Includes validators for card number (Luhn), expiry date, CVC, and cardholder name.
   */
  paymentForm = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(19), this.validationService.luhnValidator()]],
    expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\s?\/\s?([2-9][0-9])$/)]],
    cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4), Validators.pattern(/^\d+$/)]],
    cardHolder: ['Juan Pérez', [Validators.required, Validators.minLength(3)]]
  });

  /**
   * Form control for searching payment links by ID.
   * Used when no payment link ID is provided in the route.
   */
  searchControl = this.fb.control('', [Validators.required, Validators.minLength(5)]);

  /**
   * Lifecycle hook that initializes the component.
   * Loads payment link from route parameters if present.
   */
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

  /**
   * Loads a payment link by its ID from the API.
   *
   * Updates the component status to show loading state, then fetches
   * the payment link details. On success, displays the payment form.
   * On failure, shows the search interface.
   *
   * @param id - The unique identifier of the payment link to load
   *
   * @example
   * ```typescript
   * // Load payment link by ID
   * this.loadLink('pl_abc123xyz');
   * ```
   */
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

  /**
   * Handles payment link search form submission.
   *
   * Validates the search input and navigates to the payment link
   * if valid. Marks the form as touched to show validation errors if invalid.
   *
   * @example
   * ```typescript
   * // In template
   * <form (ngSubmit)="search()">
   *   <input [formControl]="searchControl" placeholder="Enter payment link ID" />
   *   <button type="submit">Search</button>
   * </form>
   * ```
   */
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

  /**
   * Processes the payment submission.
   *
   * This method orchestrates the complete payment flow:
   * 1. Validates the payment form
   * 2. Creates a card token using the PSP SDK
   * 3. Submits payment to the API with idempotency key
   * 4. Handles success/failure responses
   * 5. Updates UI state accordingly
   *
   * Implements comprehensive error handling for both SDK and API failures.
   *
   * @example
   * ```typescript
   * // In template
   * <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()">
   *   <!-- form fields -->
   *   <button type="submit" [disabled]="paymentForm.invalid">Pay</button>
   * </form>
   * ```
   */
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

    } catch {
      this.errorMessage.set('An unexpected error occurred while preparing the payment. Please try again.');
      this.status.set('ERROR_RETRYABLE');
      this.paymentForm.enable();
    }
  }

  /**
   * Formats card number input to display with spaces every 4 digits.
   *
   * Automatically removes non-numeric characters and adds spacing
   * for better readability (e.g., "4532 0151 1283 0366").
   *
   * @param event - The input event from the card number field
   *
   * @example
   * ```typescript
   * // In template
   * <input
   *   formControlName="cardNumber"
   *   (input)="formatCardNumber($event)"
   *   placeholder="1234 5678 9012 3456"
   * />
   * ```
   */
  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substring(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    this.paymentForm.controls.cardNumber.setValue(value, { emitEvent: false });
  }

  /**
   * Formats expiry date input to display as MM / YY.
   *
   * Automatically adds separator between month and year for consistent formatting.
   *
   * @param event - The input event from the expiry date field
   *
   * @example
   * ```typescript
   * // In template
   * <input
   *   formControlName="expiryDate"
   *   (input)="formatExpiryDate($event)"
   *   placeholder="MM / YY"
   * />
   * ```
   */
  formatExpiryDate(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substring(0, 4);
    if (value.length > 2) {
      value = `${value.substring(0, 2)} / ${value.substring(2)}`;
    }
    this.paymentForm.controls.expiryDate.setValue(value, { emitEvent: false });
  }

  /**
   * Resets the checkout state to allow the user to retry payment.
   *
   * Clears error messages and payment results, returning to the ready-to-pay state.
   * Used when a payment fails and the user wants to try again.
   *
   * @example
   * ```typescript
   * // In template for failed payment
   * <button (click)="retry()">Try Again</button>
   * ```
   */
  retry() {
    this.status.set('READY_TO_PAY');
    this.paymentResult.set(null);
    this.errorMessage.set(null);
  }
}
