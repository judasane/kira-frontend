
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  luhnValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      let value = control.value.toString().replace(/\s+/g, '');

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
