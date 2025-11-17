
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockPspSdkService {

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
