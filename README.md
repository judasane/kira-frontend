# 💳 Kira Payment Links - Frontend

<div align="center">

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)

**Secure, PCI-compliant payment checkout interface for Kira's cross-border payment links**

[Live Demo](#) · [Backend Repo](#) · [API Docs](swagger_api.yml) · [Report Bug](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Architecture](#-architecture)
- [Related Documentation](#-related-documentation)

---

## 🎯 Overview

Kira Payment Links Frontend is a **Single Page Application (SPA)** built with Angular that serves as the checkout interface for Kira's payment link system. This application handles the complete payment flow while maintaining **PCI DSS compliance** by tokenizing sensitive card data on the client-side, ensuring that no sensitive payment information ever reaches the backend.

### What Makes This Special?

- 🔒 **PCI-Compliant**: Card data never touches our servers
- 🌍 **Cross-Border Ready**: Designed for USD → MXN transactions
- ⚡ **State Management**: Robust UI state machine for all payment scenarios
- 🎨 **Component-Driven**: Clean, maintainable architecture with Smart/Dumb components
- ✅ **Advanced Validation**: Client-side Luhn algorithm and custom validators

---

## ✨ Key Features

### Core Functionality

- **Dynamic Payment Rendering**: Fetches and displays payment link information via `GET /payment-links/{id}`
- **Client-Side Tokenization**: Simulates PSP SDK integration for secure card tokenization
- **Multi-State Management**: Handles all payment states:
  - `LOADING_LINK` - Fetching payment details
  - `READY_TO_PAY` - Form ready for user input
  - `PROCESSING_PAYMENT` - Payment being processed
  - `COMPLETED` - Successful payment
  - `FAILED` - Payment failed (with retry option)
  - `ERROR_RETRYABLE` - Recoverable errors

### Security & Validation

- ✅ **Luhn Algorithm**: Built-in credit card number validation
- ✅ **Reactive Forms**: Real-time validation with TypeScript type safety
- ✅ **Mock Token Generation**: Format: `tok_mock_{psp}_{uuid}`
- ✅ **No Sensitive Data Transmission**: PAN and CVC never sent to backend

### User Experience

- 📊 **Fee Breakdown Component**: Transparent cost display
- 🔄 **Payment Status Feedback**: Clear success/failure messages
- ♻️ **Retry Logic**: Graceful error handling with retry capability
- 📱 **Responsive Design**: Works across devices

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Angular (latest) |
| **Language** | TypeScript |
| **Forms** | ReactiveFormsModule |
| **HTTP Client** | HttpClientModule |
| **Routing** | Angular Router |
| **Testing** | Jasmine + Karma |
| **Linting** | ESLint + Prettier |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher (comes with Node.js)
- **Angular CLI**: v17.x or higher
```bash
# Install Angular CLI globally
npm install -g @angular/cli
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/judasane/kira-frontend.git
cd kira-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment

Create or update environment files with your backend API URL:

**For Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // Local backend
  pspSimulationDelay: 2000 // Mock PSP delay in ms
};
```

**For Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.kira.com/v1', // Production backend
  pspSimulationDelay: 0
};
```

### 4. Start Development Server
```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The app will automatically reload when you make changes.

### 5. Access a Payment Link

Visit: `http://localhost:4200/checkout/{payment-link-id}`

---

## 📁 Project Structure
```
kira-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── checkout/              # Main checkout orchestrator (Smart)
│   │   │   ├── fee-breakdown/         # Fee display (Dumb)
│   │   │   └── payment-status/        # Success/failure messages (Dumb)
│   │   ├── services/
│   │   │   ├── api.service.ts         # HTTP client wrapper
│   │   │   ├── mock-psp-sdk.service.ts # PSP simulation
│   │   │   └── validation.service.ts  # Custom validators (Luhn, etc.)
│   │   ├── models/
│   │   │   ├── payment-link.model.ts  # TypeScript interfaces
│   │   │   └── payment-result.model.ts
│   │   ├── guards/
│   │   └── interceptors/
│   ├── environments/
│   │   ├── environment.ts             # Dev config
│   │   └── environment.prod.ts        # Prod config
│   └── assets/
├── .github/
│   └── workflows/
│       └── main.yml                   # CI/CD pipeline
└── angular.json                       # Angular configuration
```

### Key Components

#### 🧠 Smart Components

- **`CheckoutComponent`**
  - Orchestrates the entire payment flow
  - Manages UI state machine
  - Fetches payment link data
  - Handles form submission and API calls

#### 🎨 Dumb Components

- **`FeeBreakdownComponent`**
  - Receives `FeePreview` via `@Input()`
  - Pure presentation of cost breakdown
  
- **`PaymentStatusComponent`**
  - Displays final payment result
  - Shows success/failure messages

### Core Services

| Service | Responsibility |
|---------|---------------|
| **`ApiService`** | Wraps `HttpClient` with typed methods: `getPaymentLink()`, `processPayment()` |
| **`MockPspSdkService`** | Simulates PSP tokenization: `createToken()` returns `Promise<string>` |
| **`ValidationService`** | Provides custom validators: `luhnValidator()`, `expiryDateValidator()` |

---

## 💻 Development

### Available Scripts
```bash
# Start development server
ng serve

# Build for production
ng build --configuration production

# Run unit tests
ng test

# Run end-to-end tests
ng e2e

# Lint code
ng lint

# Format code
npm run format
```

### Development Workflow

1. **Create Feature Branch**
```bash
   git checkout -b feature/payment-retry-logic
```

2. **Make Changes** following the component architecture
   - Smart components in `components/`
   - Services in `services/`
   - Models in `models/`

3. **Write Tests** for new functionality

4. **Commit Changes**
```bash
   git commit -m "feat: add payment retry logic"
```

5. **Push and Create PR**

---

## 🧪 Testing

### Unit Tests

Run the test suite with Karma + Jasmine:
```bash
ng test
```

#### Test Coverage Areas

- ✅ **ValidationService**: Luhn algorithm correctness
- ✅ **MockPspSdkService**: Token format validation
- ✅ **FeeBreakdownComponent**: Input rendering
- ✅ **CheckoutComponent**: State machine transitions
- ✅ **ApiService**: HTTP request mocking

### Test Example
```typescript
describe('ValidationService', () => {
  it('should validate correct card number using Luhn', () => {
    const validator = ValidationService.luhnValidator();
    const control = new FormControl('4532015112830366'); // Valid test card
    expect(validator(control)).toBeNull();
  });

  it('should invalidate incorrect card number', () => {
    const validator = ValidationService.luhnValidator();
    const control = new FormControl('1234567890123456'); // Invalid
    expect(validator(control)).toEqual({ luhn: true });
  });
});
```

---

## 🚢 Deployment

### Build for Production
```bash
ng build --configuration production
```

Output will be in `dist/kira-frontend/`.

### Environment Variables

Ensure production environment file is configured:
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.kira.com/v1'
};
```

### Deployment Options

- **Vercel**: `vercel deploy --prod`
- **Netlify**: `netlify deploy --prod`
- **AWS S3 + CloudFront**: Upload `dist/` to S3 bucket
- **Firebase Hosting**: `firebase deploy`

---

## 🏗 Architecture

### State Machine Flow
```
LOADING_LINK → READY_TO_PAY → PROCESSING_PAYMENT → COMPLETED
                                                  ↓
                                               FAILED → ERROR_RETRYABLE
```

### Payment Flow Sequence

1. **User** navigates to `/checkout/{id}`
2. **App** calls `GET /payment-links/{id}` → `LOADING_LINK`
3. **Backend** returns payment details → `READY_TO_PAY`
4. **User** enters card details + submits form
5. **MockPspSdkService** tokenizes card → `tok_mock_stripe_{uuid}`
6. **App** calls `POST /payment-links/{id}/process` → `PROCESSING_PAYMENT`
7. **Backend** processes payment:
   - Success → `COMPLETED`
   - Failure → `FAILED` (with retry option)

### Component Communication
```
CheckoutComponent (Smart)
├── @Input: paymentLinkId
├── @Output: paymentCompleted
└── Children:
    ├── FeeBreakdownComponent (@Input: feeData)
    └── PaymentStatusComponent (@Input: status, @Input: message)
```

---

## 📚 Related Documentation

- **Backend API**: See `swagger_api.yml` in backend repository
- **Frontend Planning**: [`frontend_angular_plan.md`](frontend_angular_plan.md)
- **Architecture Decisions**: [ADR.md](docs/ADR.md)
- **Testing Strategy**: [TESTING.md](docs/TESTING.md)

---

## 🤝 Contributing

This project was built as part of the **Kira Product Engineer Assessment**.

For development:

1. Fork the repository
2. Create your feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

---

## 📄 License

This project is part of the Kira technical assessment.

---

## 🙏 Acknowledgments

- Built with Angular and TypeScript
- Designed for PCI DSS compliance
- Part of Kira's cross-border payment solution (USD → MXN)

---

<div align="center">

**Made with ❤️ for Kira**

[⬆ Back to Top](#-kira-payment-links---frontend)

</div>
