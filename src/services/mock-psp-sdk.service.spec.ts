import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MockPspSdkService } from './mock-psp-sdk.service';

describe('MockPspSdkService', () => {
  let service: MockPspSdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockPspSdkService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('createToken', () => {
    it('should return a token for STRIPE', async () => {
      const token = await service.createToken('STRIPE');
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token).toMatch(/^tok_mock_stripe_/);
    });

    it('should return a token for ADYEN', async () => {
      const token = await service.createToken('ADYEN');
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token).toMatch(/^tok_mock_adyen_/);
    });

    it('should return different tokens on multiple calls', async () => {
      const token1 = await service.createToken('STRIPE');
      const token2 = await service.createToken('STRIPE');
      expect(token1).not.toBe(token2);
    });

    it('should simulate network latency', async () => {
      const startTime = Date.now();
      await service.createToken('STRIPE');
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should take at least 500ms (minimum latency)
      expect(duration).toBeGreaterThanOrEqual(500);
      // Should not take more than 1500ms (maximum latency + some buffer)
      expect(duration).toBeLessThan(1500);
    });

    it('should include UUID in token', async () => {
      const token = await service.createToken('STRIPE');
      // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
      expect(token).toMatch(uuidPattern);
    });
  });
});
