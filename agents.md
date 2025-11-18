# 🧭 AGENTS.md — Kira Payment Links Frontend

> **For project overview and backend architecture, see [README.md](./README.md)**  
> This document contains **operational guidelines for AI agents** working on the Kira Payment Links Frontend codebase.

## 📘 Table of Contents

1. [Security Requirements](#1-security-requirements) 🔒
2. [Agent Permissions](#2-agent-permissions) ⚖️
3. [Development Commands](#3-development-commands) ⚡
4. [Code Standards](#4-code-standards) 📋
5. [TSDoc Documentation Standards](#5-tsdoc-documentation-standards) 📝
6. [Quality Assurance Pipeline](#6-quality-assurance-pipeline) 🛡️
7. [Style & Reactivity](#7-style--reactivity) 🎨
8. [Testing Overview](#8-testing-overview) 🧪
9. [Payment Flow Patterns](#9-payment-flow-patterns) 💳
10. [Operational Checklist](#10-operational-checklist) ✅
11. [When Stuck](#11-when-stuck) 🤔
12. [Output Format](#12-output-format) 🪄

**Note:** Git Workflow & Branch Strategy covered in section 4 (Code Standards)

---

## 1. Security Requirements

**🚨 NON-NEGOTIABLE: These security rules must ALWAYS be followed.**

### 🔐 Critical Rules for Payment Systems

```bash
# ❌ NEVER commit these files
.env
.env.*
*.key
*.pem
config/secrets.json

# ❌ NEVER store real card data (even in mock mode)
const cardNumber = "4242424242424242"  # BAD
const cvv = "123"                       # BAD

# ❌ NEVER send real card data to backend
// This is WRONG - even in development
fetch('/api/payments', {
  body: JSON.stringify({ cardNumber, cvv, expiry })
})

# ✅ ALWAYS use tokenization pattern
// Frontend generates mock token
const cardToken = generateMockToken()
fetch('/api/payments', {
  body: JSON.stringify({ cardToken })  // Only send token
})
```

### Payment Security Checklist

- [ ] `.env*` ignored by git
- [ ] No card data stored in localStorage/sessionStorage
- [ ] Card validation happens client-side only
- [ ] Only mock tokens sent to API
- [ ] CSP headers configured for production
- [ ] HTTPS enforced in production

| Data Type       | Storage Location | Transmission       |
| --------------- | ---------------- | ------------------ |
| **Card Number** | Memory only      | Never sent         |
| **CVV**         | Memory only      | Never sent         |
| **Expiry**      | Memory only      | Never sent         |
| **Card Token**  | Memory only      | Sent to API        |
| **API Keys**    | Environment vars | HTTPS only         |

---

## 2. Agent Permissions

**⚖️ Operational boundaries for AI automation.**

### ✅ Allowed (Level 2 — Sandbox)

| Action                 | Example Commands                   | Notes           |
| ---------------------- | ---------------------------------- | --------------- |
| **Read/analyze files** | `cat`, `ls`, `grep`                | Full access     |
| **Lint & format**      | `npm run lint`, `prettier --write` | Reversible      |
| **Type check**         | `tsc --noEmit`                     | Safe            |
| **Run tests**          | `npm test`, `vitest run`           | Non-destructive |
| **Build preview**      | `npm run build`                    | Validation only |
| **Dev server**         | `npm run dev`                      | Local only      |

### 🟡 Requires User Approval (Level 3 — Privileged)

| Action                      | Command                       | Reason                   |
| --------------------------- | ----------------------------- | ------------------------ |
| **Install packages**        | `npm install <pkg>`           | Alters dependencies      |
| **Git operations**          | `git push`, `merge`, `rebase` | Affects repo state       |
| **Create feature branch**   | `git checkout -b feat/name`   | Must follow naming convention |
| **Delete files**            | `rm`, `rmdir`                 | Irreversible             |
| **Edit environment/config** | `.env`, `vite.config.ts`      | Security impact          |
| **Call external APIs**      | Network writes                | May trigger side effects |
| **Modify payment logic**    | Changes to payment services   | Financial impact         |

### 🚫 Prohibited (Never Allowed)

| Action                      | Command                       | Reason                   |
| --------------------------- | ----------------------------- | ------------------------ |
| **Push to main directly**   | `git push origin main`        | Breaks PR workflow       |
| **Merge without approval**  | `git merge feat/x` on main    | Requires code review     |
| **Force push to main**      | `git push -f origin main`     | Destructive              |

**Before L3 actions, agent must:**

1. Display the command and parameters
2. Explain the impact on payment flows
3. Wait for explicit approval

---

## 3. Development Commands

**⚡ Prefer fast, file-scoped commands for low-cost feedback.**

### Global Commands

| Task         | Command           | Notes                |
| ------------ | ----------------- | -------------------- |
| Install deps | `npm install`     | First-time setup     |
| Serve dev    | `npm run dev`     | Opens on port 4200   |
| Build        | `npm run build`   | Production bundle    |
| Preview      | `npm run preview` | Test production build|
| Test all     | `npm test`        | Unit tests (Vitest)  |
| Test watch   | `npm test -- --watch` | Watch mode       |
| Lint all     | `npm run lint`    | ESLint check         |
| Lint fix     | `npm run lint -- --fix` | Auto-fix issues |

### Testing Commands

| Task                        | Command                      |
| --------------------------- | ---------------------------- |
| Unit tests                  | `npm test`                   |
| Unit tests with coverage    | `npm test -- --coverage`     |
| Install Playwright browsers | `npm run playwright:install` |
| E2E tests                   | `npm run test:e2e`           |
| E2E UI mode                 | `npm run test:e2e:ui`        |
| E2E headed mode             | `npm run test:e2e:headed`    |

### File-Scoped Examples

```bash
# Lint specific file
npx eslint src/app/components/payment-form/payment-form.component.ts --fix

# Format specific file
npx prettier --write src/app/services/payment.service.ts

# Type check specific file
npx tsc --noEmit src/app/models/payment.models.ts

# Test specific file
npm test -- src/app/services/payment.service.spec.ts
```

### Angular CLI Shortcuts

```bash
# Generate component
ng generate component components/checkout-summary

# Generate service
ng generate service services/fx-rate

# Generate interface
ng generate interface models/payment-link

# Generate guard
ng generate guard guards/payment-link
```

---

## 4. Code Standards

### Naming & Structure

| Type             | Format     | Example                      |
| ---------------- | ---------- | ---------------------------- |
| Component        | PascalCase | `PaymentFormComponent`       |
| Service          | PascalCase | `PaymentService`             |
| Interface / Type | PascalCase | `PaymentLink`, `Transaction` |
| File             | kebab-case | `payment-form.component.ts`  |
| Selector         | kebab-case | `<app-payment-form>`         |
| Signal           | camelCase  | `paymentStatus`              |

### Core Principles for Payment Systems

- **Never** use `any` type in payment-related code
- **Never** log sensitive data (card info, tokens)
- **Always** validate user input before API calls
- **Always** handle errors gracefully with user-friendly messages
- **Always** use signals for reactive state
- Use `Readonly` for configuration objects
- Split logic: services for business logic, components for UI
- No direct DOM access → use `Renderer2`
- Prefer `ChangeDetectionStrategy.OnPush`

### Angular 20+ Modern Patterns

**🎯 This project uses Angular 20.x with modern patterns:**

- **Zoneless Change Detection**: Configured with `provideZonelessChangeDetection()`
- **Standalone Components**: All components must have `standalone: true`
- **Signals for State**: Use `signal()` and `computed()` for reactive state
- **Effects for Side Effects**: Use `effect()` for side effects based on signal changes

```typescript
// Example: Payment form with signals
@Component({
  selector: 'app-payment-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentFormComponent {
  // State signals
  cardNumber = signal('');
  isProcessing = signal(false);
  
  // Computed validation
  isValidCard = computed(() => 
    this.luhnCheck(this.cardNumber())
  );
  
  constructor() {
    // Side effect when processing changes
    effect(() => {
      const processing = this.isProcessing();
      if (processing) {
        this.disableForm();
      }
    });
  }
}
```

### Payment Flow Architecture

**Key Payment Components:**
- `CheckoutComponent` — Main checkout page (hosts payment flow)
- `PaymentFormComponent` — Card input with validation
- `FeeBreakdownComponent` — Fee transparency display
- `PaymentSummaryComponent` — Order summary with FX conversion
- `PaymentStatusComponent` — Success/failure states

**Key Services:**
- `PaymentService` — Payment orchestration and API calls
- `FxRateService` — Real-time FX rate fetching
- `TokenizationService` — Mock card tokenization
- `ValidationService` — Card validation (Luhn, expiry, CVV)

**Models Location:** `src/app/models/`

### Card Validation Patterns

```typescript
/**
 * Card validation must happen client-side only.
 * Never send raw card data to backend.
 */

// ✅ CORRECT: Validate and tokenize
const isValid = validateCard(cardNumber, cvv, expiry);
if (isValid) {
  const token = generateMockToken(cardNumber);
  await paymentService.processPayment(token);
}

// ❌ WRONG: Send raw card data
await paymentService.processPayment({
  cardNumber,  // Never send this
  cvv,         // Never send this
  expiry       // Never send this
});
```

### Design Principles: YAGNI, KISS, and SOLID

| Principle | Check                                                                           |
| --------- | ------------------------------------------------------------------------------- |
| **YAGNI** | Is this feature used now? If not, remove it.                                    |
| **KISS**  | Can it be understood in <5 minutes? Simplify if not.                            |
| **SOLID** | Does each class/module have a single responsibility? Are dependencies injected? |

### Git Workflow & Branch Strategy

**🚨 CRITICAL: Never commit directly to `main` branch**

All changes must follow this workflow:

1. **Create feature branch** from `main`
2. **Make commits** to your feature branch
3. **Create Pull Request** for review
4. **Wait for approval** from team member
5. **Merge** only after approval

```bash
# ❌ NEVER DO THIS
git checkout main
git commit -m "feat: add payment feature"
git push origin main

# ✅ CORRECT WORKFLOW
git checkout main
git pull origin main
git checkout -b feat/payment-tokenization
git commit -m "feat(payment): add mock tokenization"
git push origin feat/payment-tokenization
# Then create PR via GitHub/GitLab UI
```

### Branch Naming Convention

| Type       | Pattern                    | Example                        |
| ---------- | -------------------------- | ------------------------------ |
| Feature    | `feat/short-description`   | `feat/card-validation`         |
| Bug Fix    | `fix/short-description`    | `fix/expiry-date-validation`   |
| Refactor   | `refactor/short-description` | `refactor/payment-service`   |
| Hotfix     | `hotfix/short-description` | `hotfix/critical-security`     |
| Docs       | `docs/short-description`   | `docs/update-agents-md`        |

### Git Commits

**Use [Conventional Commits](https://www.conventionalcommits.org/)**: `type(scope): description`

Common types for payment systems:
- `feat(payment)`: New payment feature
- `fix(validation)`: Fix card validation bug
- `refactor(checkout)`: Refactor checkout flow
- `test(payment)`: Add payment tests
- `docs(api)`: Update API documentation
- `security(tokenization)`: Security improvement

Breaking changes: add `!` → `feat(payment)!: change token format`

### Pull Request Guidelines

**All PRs must include:**

- [ ] Clear title following conventional commits
- [ ] Description of changes and why
- [ ] Link to related issue/ticket (if applicable)
- [ ] Screenshots for UI changes
- [ ] Test coverage maintained/improved
- [ ] No breaking changes (or clearly documented)
- [ ] All CI checks passing

**PR Review Checklist:**

- [ ] Code follows style guide
- [ ] No security vulnerabilities introduced
- [ ] Payment logic has 100% test coverage
- [ ] No sensitive data logged or exposed
- [ ] Error handling is appropriate
- [ ] Documentation updated if needed

---

## 5. TSDoc Documentation Standards

**📝 All exported APIs must have TSDoc comments.**

> **Full spec:** [tsdoc.org](https://tsdoc.org/)

### Team Conventions

1. **Inline examples with "e.g.,"** - Every `@param`, `@returns`, and interface property MUST include example value
2. **@example blocks MANDATORY** - All payment-related functions must have examples
3. **Strict tag order** - Summary → @param → @returns → @throws → @example (non-negotiable)

### Payment System Documentation

````typescript
/**
 * Processes a payment using a tokenized card.
 *
 * @param paymentLinkId - Unique identifier for the payment link. E.g., 'pl_abc123xyz'
 * @param cardToken - Mock tokenized card data. E.g., 'tok_visa_4242'
 * @param idempotencyKey - Unique key to prevent duplicate charges. E.g., 'uuid-v4-string'
 * @returns Payment result with transaction details. E.g., { transactionId: 'txn_123', status: 'COMPLETED' }
 * @throws {PaymentError} When payment processing fails
 *
 * @example
 * ```typescript
 * const paymentService = inject(PaymentService);
 * const result = await paymentService.processPayment(
 *   'pl_abc123',
 *   'tok_visa_4242',
 *   crypto.randomUUID()
 * );
 * if (result.status === 'COMPLETED') {
 *   console.log('Payment successful:', result.transactionId);
 * }
 * ```
 */
async processPayment(
  paymentLinkId: string,
  cardToken: string,
  idempotencyKey: string
): Promise<PaymentResult> {
  // implementation
}
````

---

## 6. Quality Assurance Pipeline

🛡️ Every commit MUST pass the pipeline below:

### Step 1. Lint & Style

```bash
npm run lint -- --fix
npx prettier --write "src/**/*.{ts,html,scss}"
```

### Step 2. Unit Tests

```bash
npm test -- --coverage
```

✅ **Minimum: 80% coverage**

**Critical: Payment logic must have 100% coverage**

### Step 3. Type & Build Verification

```bash
npx tsc --noEmit
npm run build
```

### Step 4. E2E Tests

**Important:** Install Playwright browsers first-time only:

```bash
npm run playwright:install
npm run test:e2e
```

### Quality Matrix

| Check      | Tool       | Target                 | Critical For |
| ---------- | ---------- | ---------------------- | ------------ |
| **Lint**   | ESLint     | 100% clean             | All files    |
| **Format** | Prettier   | 100% consistent        | All files    |
| **Test**   | Vitest     | ≥ 80% coverage         | All code     |
| **Payment**| Vitest     | 100% coverage          | Payment code |
| **E2E**    | Playwright | All flows passing      | Checkout     |
| **Type**   | TypeScript | 0 errors               | All files    |
| **Build**  | Vite       | Pass                   | Production   |
| **Docs**   | TSDoc      | All exports documented | Public APIs  |

---

## 7. Style & Reactivity

### CSS / Tailwind

- TailwindCSS for utility classes
- Component-scoped `.scss` for custom styles
- Avoid `::ng-deep` except when necessary
- Use **mobile-first** approach
- Payment forms must be responsive (mobile-optimized)

### Color Scheme for Payment States

```scss
// Success
.payment-success { @apply bg-green-50 text-green-700 border-green-300; }

// Error
.payment-error { @apply bg-red-50 text-red-700 border-red-300; }

// Processing
.payment-processing { @apply bg-blue-50 text-blue-700 border-blue-300; }

// Warning (e.g., FX volatility)
.payment-warning { @apply bg-yellow-50 text-yellow-700 border-yellow-300; }
```

### RxJS Usage

- Prefer **Signals** for local component state
- Use **Observables** for async operations (HTTP calls)
- Use `takeUntilDestroyed()` for subscription cleanup
- Combine flows with `switchMap`, `catchError`
- Always prefer `async` pipe in templates

```typescript
// ✅ CORRECT: Observable for HTTP + Signal for state
export class PaymentService {
  private http = inject(HttpClient);
  
  processPayment(data: PaymentData): Observable<PaymentResult> {
    return this.http.post<PaymentResult>('/api/payments', data).pipe(
      catchError(this.handlePaymentError)
    );
  }
}

export class PaymentFormComponent {
  private paymentService = inject(PaymentService);
  paymentStatus = signal<'idle' | 'processing' | 'success' | 'error'>('idle');
  
  submitPayment() {
    this.paymentStatus.set('processing');
    this.paymentService.processPayment(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => this.paymentStatus.set('success'),
        error: () => this.paymentStatus.set('error')
      });
  }
}
```

---

## 8. Testing Overview

**🧪 This project uses separate testing strategies for different concerns.**

### Testing Structure

| Test Type       | Framework  | Extension   | Location                    | Purpose                |
| --------------- | ---------- | ----------- | --------------------------- | ---------------------- |
| **Unit Tests**  | Vitest     | `.spec.ts`  | `src/app/**/*.spec.ts`      | Component/Service unit tests |
| **E2E Tests**   | Playwright | `.test.ts`  | `tests/**/*.test.ts`        | Full payment journey validation |

### Test Configuration

- **Unit Tests Setup**: `src/test-setup.ts` (JSDOM mocks)
- **E2E Tests Config**: `playwright.config.ts` (browser automation)
- **Coverage Thresholds**: 80% minimum, 100% for payment logic

### When to Use Each Test Type

**Use Unit Tests (Vitest) for:**
- Card validation logic (Luhn algorithm, expiry, CVV)
- Mock tokenization service
- Fee calculation logic
- FX conversion calculations
- Error handling and edge cases

**Use E2E Tests (Playwright) for:**
- Complete checkout flow (link → form → payment → result)
- Payment success/failure scenarios
- FX rate volatility handling
- PSP failover scenarios
- Idempotency key handling

### Payment-Specific Test Patterns

```typescript
// Unit test: Card validation
describe('CardValidationService', () => {
  it('should validate valid Visa card', () => {
    const service = new CardValidationService();
    expect(service.validateCard('4242424242424242')).toBe(true);
  });
  
  it('should reject invalid card number', () => {
    const service = new CardValidationService();
    expect(service.validateCard('1234567890123456')).toBe(false);
  });
});

// E2E test: Complete payment flow
test('should complete payment successfully', async ({ page }) => {
  await page.goto('/checkout/pl_test123');
  await page.fill('[data-testid="card-number"]', '4242424242424242');
  await page.fill('[data-testid="cvv"]', '123');
  await page.fill('[data-testid="expiry"]', '12/25');
  await page.click('[data-testid="submit-payment"]');
  await expect(page.locator('[data-testid="payment-success"]')).toBeVisible();
});
```

---

## 9. Payment Flow Patterns

### 🔄 Complete Payment Flow

```
1. User lands on checkout page with link_id
   ↓
2. Frontend fetches payment link details (GET /api/payment-links/{id})
   ↓
3. Display: USD amount, FX rate, MXN estimate, fee breakdown
   ↓
4. User enters card details
   ↓
5. Client-side validation (Luhn, expiry, CVV)
   ↓
6. Generate mock token (never send real card data)
   ↓
7. Call payment API (POST /api/payments)
   - paymentLinkId
   - cardToken
   - idempotencyKey (generated client-side)
   ↓
8. Handle response:
   - COMPLETED → Show success page
   - FAILED → Show error with retry option
   - PENDING → Poll for status or wait for webhook
```

### State Management Pattern

```typescript
/**
 * Payment flow states
 */
type PaymentFlowState =
  | { status: 'loading' }
  | { status: 'ready'; data: PaymentLink }
  | { status: 'validating' }
  | { status: 'processing' }
  | { status: 'success'; transaction: Transaction }
  | { status: 'error'; error: PaymentError; canRetry: boolean };

// Component usage
export class CheckoutComponent {
  state = signal<PaymentFlowState>({ status: 'loading' });
  
  // Computed derived state
  canSubmit = computed(() => {
    const s = this.state();
    return s.status === 'ready' || (s.status === 'error' && s.canRetry);
  });
}
```

### Error Handling Pattern

```typescript
/**
 * Standardized payment error handling
 */
interface PaymentError {
  code: 'VALIDATION_ERROR' | 'PAYMENT_DECLINED' | 'NETWORK_ERROR' | 'TECHNICAL_ERROR';
  message: string;
  userMessage: string;  // Friendly message for display
  canRetry: boolean;
}

// Service implementation
handlePaymentError(error: unknown): Observable<never> {
  const paymentError: PaymentError = {
    code: this.classifyError(error),
    message: error instanceof Error ? error.message : 'Unknown error',
    userMessage: this.getUserFriendlyMessage(error),
    canRetry: this.isRetryable(error)
  };
  
  return throwError(() => paymentError);
}
```

### Idempotency Pattern

```typescript
/**
 * Generate idempotency key for payment requests
 * Prevents duplicate charges on retry
 */
export class PaymentFormComponent {
  private idempotencyKey = signal<string>(crypto.randomUUID());
  
  submitPayment() {
    // Use same key for retries within this session
    const key = this.idempotencyKey();
    
    this.paymentService.processPayment({
      paymentLinkId: this.linkId,
      cardToken: this.tokenizedCard(),
      idempotencyKey: key
    }).subscribe({
      next: (result) => {
        // Success - generate new key for next payment
        this.idempotencyKey.set(crypto.randomUUID());
      },
      error: (error) => {
        // Keep same key for retry
      }
    });
  }
}
```

### FX Volatility Handling

```typescript
/**
 * Display FX volatility warning to users
 */
export class FeeBreakdownComponent {
  private fxService = inject(FxRateService);
  
  fxRate = signal<number | null>(null);
  showVolatilityWarning = signal(true);
  
  ngOnInit() {
    // Fetch rate on preview
    this.fxService.getCurrentRate('USD', 'MXN')
      .subscribe(rate => this.fxRate.set(rate));
  }
  
  // Template shows:
  // "⚠️ Exchange rate may vary slightly at payment time"
}
```

---

## 10. Operational Checklist

| ✅ Checkpoint        | Requirement                                    |
| -------------------- | ---------------------------------------------- |
| **Typing strict**    | `noImplicitAny`, `strictNullChecks`            |
| **Coverage**         | ≥ 80% overall, 100% for payment logic          |
| **Style**            | Prettier + ESLint clean                        |
| **TSDoc**            | All exported entities documented with examples |
| **Change Detection** | `OnPush` for all components                    |
| **Signals**          | Use for reactive state (zoneless)              |
| **Async**            | Use Observables + `async` pipe                 |
| **Card Security**    | Never log/store/transmit real card data        |
| **Tokenization**     | Always tokenize before sending to backend      |
| **Idempotency**      | All payment requests include idempotency key   |
| **Error Handling**   | User-friendly messages for all error states    |
| **Git Workflow**     | Always work on feature branch, never push to main |
| **Pull Requests**    | All changes via PR with approval required      |
| **Permissions**      | Follow L2/L3 rules before destructive actions  |

---

## 11. When Stuck 🤔

If uncertain about a change:

1. Do **not** make speculative edits, especially in payment logic.
2. Propose a **short execution plan** summarizing what you intend to modify.
3. For payment-related changes, explain the security implications.
4. Ask the user for confirmation or create a **draft PR** with notes.
5. Document unresolved questions in a comment block before continuing.
6. **Never push directly to main** - always work on a feature branch.

**Special considerations for payment code:**
- Always explain impact on payment flow
- Highlight any changes to validation logic
- Note any changes to error handling
- Clarify any changes to tokenization process

**Git workflow when stuck:**
```bash
# If you started work but are uncertain
git stash                           # Save current work
git checkout main                   # Return to main
git pull origin main                # Update main
git checkout -b draft/exploration   # Create draft branch
git stash pop                       # Restore work
# Create draft PR for discussion
```

---

## 12. Output Format (Do / Understand / Undo) 🪄

When delivering changes to the user:

1. **Do:** Provide exact commands or code to apply.
2. **Understand:** Explain the intent and impact on payment flow.
3. **Undo:** Include precise revert steps.

**Example 1: Running Tests**

```
DO:
npm test -- src/app/services/payment.service.spec.ts
```

**UNDERSTAND:**
This runs unit tests for the payment service to verify tokenization logic works correctly.

**UNDO:**
No undo needed - test execution doesn't modify code.

---

**Example 2: Creating a Feature Branch**

```
DO:
git checkout main
git pull origin main
git checkout -b feat/card-validation-improvement
```

**UNDERSTAND:**
Creates a new feature branch from updated main to work on card validation improvements.
This follows the PR workflow and ensures we never commit directly to main.

**UNDO:**
```bash
git checkout main
git branch -D feat/card-validation-improvement
```

---

**Example 3: Committing Changes**

```
DO:
git add src/app/services/validation.service.ts
git commit -m "feat(validation): improve Luhn algorithm performance"
git push origin feat/card-validation-improvement
```

**UNDERSTAND:**
Commits validation improvements to feature branch and pushes for PR creation.
Follows conventional commits format for clear change tracking.

**UNDO:**
```bash
git reset --soft HEAD~1  # Undo commit, keep changes
# or
git reset --hard HEAD~1  # Undo commit and discard changes
```

---

## 📚 Project-Specific References

### Payment Link Structure

```typescript
interface PaymentLink {
  id: string;               // e.g., 'pl_abc123'
  merchantId: string;       // e.g., 'merchant_xyz'
  amountUsd: number;        // e.g., 100.00
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
  expiresAt: Date;
  metadata?: Record<string, unknown>;
}
```

### Transaction States

```typescript
type TransactionStatus = 
  | 'PENDING'      // Initial state, payment in progress
  | 'COMPLETED'    // Payment successful
  | 'FAILED';      // Payment declined or error
```

### PSP Integration

```typescript
interface PSPAttempt {
  psp: 'STRIPE' | 'ADYEN';
  status: 'SUCCESS' | 'DECLINE' | 'ERROR';
  attemptedAt: Date;
  latencyMs: number;
}
```

---

## 🔐 Security Reminders

**CRITICAL: Never compromise on these security principles:**

1. ❌ Never log card numbers, CVV, or expiry dates
2. ❌ Never store card data in localStorage or sessionStorage
3. ❌ Never send raw card data to backend
4. ✅ Always tokenize card data client-side (mock for this project)
5. ✅ Always validate card data before tokenization
6. ✅ Always use HTTPS in production
7. ✅ Always include idempotency keys in payment requests
8. ✅ Always show clear error messages without exposing system internals

---

## 🎯 Success Criteria

A successful implementation of Kira Payment Links Frontend includes:

- ✅ Checkout page loads payment link details correctly
- ✅ FX rate displays accurately with real-time updates
- ✅ Fee breakdown is clear and transparent
- ✅ Card validation works for all major card types
- ✅ Mock tokenization prevents real card data transmission
- ✅ Payment submission handles success/failure/retry flows
- ✅ Error messages are user-friendly and actionable
- ✅ All payment logic has 100% test coverage
- ✅ E2E tests cover complete payment journey
- ✅ No sensitive data logged or exposed

---

> 🧠 **Note:**
> AGENTS.md is the single source of truth for automated and human contributors.  
> All AI agents must respect this document's hierarchy and constraints.  
> When uncertain, especially with payment logic, pause execution, summarize the plan, and request user confirmation.  
> **Security and accuracy are paramount in payment systems.**
> 
> **Git Workflow Reminder:**  
> ⚠️ **NEVER commit directly to `main` branch**  
> ✅ Always work on feature branches  
> ✅ All changes must go through Pull Request review  
> ✅ Wait for approval before merging
