
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Service that provides custom validators for Angular forms.
 *
 * This service contains reusable validation functions that can be applied
 * to form controls to ensure data integrity and correctness.
 *
 * @example
 * ```typescript
 * const validationService = inject(ValidationService);
 *
 * const form = this.fb.group({
 *   cardNumber: ['', [Validators.required, validationService.luhnValidator()]]
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  /**
   * Creates a validator function that validates card numbers using the Luhn algorithm.
   *
   * The Luhn algorithm (also known as modulus 10 algorithm) is a checksum formula
   * used to validate credit card numbers, IMEI numbers, and other identification numbers.
   * It protects against accidental errors but not malicious attacks.
   *
   * @returns A validator function that returns null if valid, or an object with 'luhn' property if invalid
   *
   * @example
   * ```typescript
   * // Valid card number
   * const control1 = new FormControl('4532015112830366');
   * const validator = validationService.luhnValidator();
   * validator(control1); // Returns null (valid)
   *
   * // Invalid card number
   * const control2 = new FormControl('1234567890123456');
   * validator(control2); // Returns { luhn: true } (invalid)
   *
   * // Card number with spaces (automatically handled)
   * const control3 = new FormControl('4532 0151 1283 0366');
   * validator(control3); // Returns null (valid)
   * ```
   */
  luhnValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const value = control.value.toString().replace(/\s+/g, '');

      if (!/^\d+$/.test(value)) {
        return { luhn: true }; // Not a number
      }

      let sum = 0;
      let shouldDouble = false;
      for (let i = value.length - 1; i >= 0; i--) {
        let digit = parseInt(value.charAt(i), 10);

        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
      }

      return (sum % 10) === 0 ? null : { luhn: true };
    };
  }
}
