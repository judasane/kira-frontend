import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationService);
  });

  describe('luhnValidator', () => {
    it('should be created', () => {
      expect(service).toBeDefined();
    });

    it('should return null for empty value', () => {
      const validator = service.luhnValidator();
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });

    it('should return null for null value', () => {
      const validator = service.luhnValidator();
      const control = new FormControl(null);
      expect(validator(control)).toBeNull();
    });

    it('should return error for non-numeric value', () => {
      const validator = service.luhnValidator();
      const control = new FormControl('abcd');
      expect(validator(control)).toEqual({ luhn: true });
    });

    it('should return error for invalid card number', () => {
      const validator = service.luhnValidator();
      const control = new FormControl('1234567890123456');
      expect(validator(control)).toEqual({ luhn: true });
    });

    it('should return null for valid card number (Visa)', () => {
      const validator = service.luhnValidator();
      // Valid test Visa card number
      const control = new FormControl('4532015112830366');
      expect(validator(control)).toBeNull();
    });

    it('should return null for valid card number (Mastercard)', () => {
      const validator = service.luhnValidator();
      // Valid test Mastercard number
      const control = new FormControl('5425233430109903');
      expect(validator(control)).toBeNull();
    });

    it('should handle card numbers with spaces', () => {
      const validator = service.luhnValidator();
      const control = new FormControl('4532 0151 1283 0366');
      expect(validator(control)).toBeNull();
    });

    it('should return error for card number with invalid checksum', () => {
      const validator = service.luhnValidator();
      const control = new FormControl('4532015112830367');
      expect(validator(control)).toEqual({ luhn: true });
    });

    it('should validate simple valid Luhn number', () => {
      const validator = service.luhnValidator();
      const control = new FormControl('79927398713');
      expect(validator(control)).toBeNull();
    });

    it('should reject simple invalid Luhn number', () => {
      const validator = service.luhnValidator();
      const control = new FormControl('79927398714');
      expect(validator(control)).toEqual({ luhn: true });
    });
  });
});
