
import { Injectable } from '@angular/core';

/**
 * Mock service that simulates PSP (Payment Service Provider) SDK functionality.
 *
 * This service mimics the behavior of real payment provider SDKs (like Stripe or Adyen)
 * for development and testing purposes. It simulates card tokenization with realistic
 * network latency and generates mock tokens.
 *
 * In production, this would be replaced with actual PSP SDK integrations.
 *
 * @example
 * ```typescript
 * const mockSdk = inject(MockPspSdkService);
 *
 * // Create a Stripe token
 * const stripeToken = await mockSdk.createToken('STRIPE');
 * console.log('Token:', stripeToken); // "tok_mock_stripe_..."
 * ```
 *
 * @example
 * ```typescript
 * // Create an Adyen token
 * const adyenToken = await mockSdk.createToken('ADYEN');
 * console.log('Token:', adyenToken); // "tok_mock_adyen_..."
 * ```
 *
 * @example
 * ```typescript
 * // Use in payment flow
 * async processPayment() {
 *   try {
 *     const cardToken = await this.mockSdk.createToken('STRIPE');
 *     // Use token for payment processing...
 *   } catch (error) {
 *     console.error('Tokenization failed');
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class MockPspSdkService {

  /**
   * Creates a mock payment token for the specified PSP provider.
   *
   * Simulates the tokenization process that happens in real PSP SDKs, including
   * realistic network latency (500-1000ms). Generates a unique mock token that
   * can be used for testing payment flows.
   *
   * @param psp - The payment service provider to create a token for
   * @returns Promise that resolves to a mock token string
   *
   * @example
   * ```typescript
   * // Create Stripe token with async/await
   * const token = await mockSdk.createToken('STRIPE');
   * console.log(token); // "tok_mock_stripe_abc-123-def-456"
   * ```
   *
   * @example
   * ```typescript
   * // Create Adyen token with Promise
   * mockSdk.createToken('ADYEN').then(token => {
   *   console.log('Adyen token created:', token);
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Handle in component
   * async onSubmit() {
   *   this.loading = true;
   *   try {
   *     const cardToken = await this.mockSdk.createToken('STRIPE');
   *     await this.apiService.processPayment(linkId, {
   *       cardToken,
   *       pspProvider: 'STRIPE',
   *       // ...
   *     });
   *   } finally {
   *     this.loading = false;
   *   }
   * }
   * ```
   */
  createToken(psp: 'STRIPE' | 'ADYEN'): Promise<string> {
    return new Promise(resolve => {
      // Simulate network latency for the tokenization request
      const latency = 500 + Math.random() * 500; // 500ms to 1000ms

      setTimeout(() => {
        const token = `tok_mock_${psp.toLowerCase()}_${crypto.randomUUID()}`;
        resolve(token);
      }, latency);
    });
  }
}
