
# 💳 Kira Payment Links - Frontend

<div align="center">

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Secure, PCI-compliant payment checkout interface for Kira's cross-border payment links**

[Live Demo](https://judasane.github.io/kira-frontend/) · [Backend Repo](https://github.com/judasane/kira)

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
- [Configuration](#-configuration)
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
  - `INITIALIZING` - Application startup
  - `AWAITING_INPUT` - Waiting for payment link ID
  - `LOADING_LINK` - Fetching payment details
  - `LINK_NOT_FOUND` - Invalid or expired link
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
| **Framework** | Angular 20.x |
| **Language** | TypeScript |
| **Forms** | ReactiveFormsModule |
| **HTTP Client** | HttpClientModule |
| **Routing** | Angular Router |
| **Styling** | TailwindCSS (CDN) |
| **Change Detection** | Zoneless (Signals) |
| **Component Style** | Standalone Components |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.19.0 or higher
- **npm**: v9.x or higher (comes with Node.js)
- **Angular CLI**: v20.x or higher (optional, project uses custom setup)

```bash
# Verify installations
node --version
npm --version
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

### 3. Configure API Endpoint

The API URL is configured in `src/services/api.service.ts`:

```typescript
// Current configuration
private baseUrl = 'https://kira-payment-api.onrender.com';

// For local development, change to:
// private baseUrl = 'http://localhost:3000';
```

**Note**: This project doesn't use traditional Angular environment files. The API endpoint is directly configured in the service.

### 4. Start Development Server
```bash
npm run dev
```

Navigate to `http://localhost:9002/` in your browser. The app will automatically reload when you make changes.

### 5. Access a Payment Link

Visit: `http://localhost:9002/#/links/{payment-link-id}`

Or use the search interface at: `http://localhost:9002/`

---

## 📁 Project Structure
```
kira-frontend/
├── src/
│   ├── app.component.ts           # Root component
│   ├── app.component.html         # Root template
│   ├── app.routes.ts              # Route configuration
│   ├── components/
│   │   ├── checkout/              # Main checkout orchestrator (Smart)
│   │   │   ├── checkout.component.ts
│   │   │   └── checkout.component.html
│   │   ├── fee-breakdown/         # Fee display (Dumb)
│   │   │   ├── fee-breakdown.component.ts
│   │   │   └── fee-breakdown.component.html
│   │   └── payment-status/        # Success/failure messages (Dumb)
│   │       ├── payment-status.component.ts
│   │       └── payment-status.component.html
│   ├── services/
│   │   ├── api.service.ts         # HTTP client wrapper
│   │   ├── mock-psp-sdk.service.ts # PSP simulation
│   │   └── validation.service.ts  # Custom validators (Luhn, etc.)
│   └── models/
│       └── payment.model.ts       # All TypeScript interfaces
├── .github/
│   └── workflows/
│       ├── deploy.yml             # GitHub Pages deployment
│       └── flat.yml               # Repository flattening
├── index.html                     # Main HTML file
├── index.tsx                      # Application bootstrap
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── angular.json                   # Angular CLI configuration
├── README.md                      # This file
└── agents.md                      # AI agent guidelines
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
| **`ValidationService`** | Provides custom validators: `luhnValidator()` |

---

## 💻 Development

### Available Scripts
```bash
# Start development server (port 9002)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
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

3. **Commit Changes**
```bash
   git commit -m "feat: add payment retry logic"
```

4. **Push and Create PR**

---

## ⚙️ Configuration

### API Service Configuration

The API endpoint is configured directly in the service:

**File**: `src/services/api.service.ts`

```typescript
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://kira-payment-api.onrender.com'; 

  getPaymentLink(id: string): Observable<PaymentLinkWithPreviewResponse> {
    return this.http.get<PaymentLinkWithPreviewResponse>(`${this.baseUrl}/payment-links/${id}`);
  }

  processPayment(id: string, request: ProcessPaymentRequest): Observable<ProcessPaymentResponse> {
    return this.http.post<ProcessPaymentResponse>(`${this.baseUrl}/payment-links/${id}/payments`, request);
  }
}
```

**To change the API URL:**

1. Open `src/services/api.service.ts`
2. Modify the `baseUrl` property:
   - **Production**: `'https://kira-payment-api.onrender.com'`
   - **Local Development**: `'http://localhost:3000'`
   - **Staging**: `'https://staging-api.kira.com'`

### Mock PSP Configuration

The mock PSP service simulates tokenization latency:

**File**: `src/services/mock-psp-sdk.service.ts`

```typescript
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
```

**To adjust tokenization delay:**
- Modify the `latency` calculation for faster/slower simulations
- For production, replace with actual PSP SDK integration

---

## 🚢 Deployment

### GitHub Pages (Current Setup)

This project is configured to deploy to GitHub Pages automatically.

**Deployment Workflow**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Build application
        run: npm run build -- --configuration production

      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

**Live URL**: https://judasane.github.io/kira-frontend/

### Manual Deployment

#### Build for Production
```bash
npm run build
```

Output will be in `dist/` directory.

#### Deploy to Other Platforms

**Option 1: Vercel**
```bash
npm install -g vercel
vercel deploy --prod
```

**Option 2: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option 3: AWS S3 + CloudFront**
```bash
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**Option 4: Firebase Hosting**
```bash
firebase deploy
```

---

## 🏗 Architecture

### State Machine Flow
```
INITIALIZING → AWAITING_INPUT → LOADING_LINK → READY_TO_PAY → PROCESSING_PAYMENT → COMPLETED
                      ↓              ↓                                                    ↓
                LINK_NOT_FOUND  LINK_NOT_FOUND                                        FAILED
                                                                                         ↓
                                                                                   ERROR_RETRYABLE
```

### Payment Flow Sequence

1. **User** navigates to `/links/{id}` or enters ID manually
2. **App** calls `GET /payment-links/{id}` → `LOADING_LINK`
3. **Backend** returns payment details → `READY_TO_PAY`
4. **User** enters card details + submits form
5. **MockPspSdkService** tokenizes card → `tok_mock_stripe_{uuid}`
6. **App** calls `POST /payment-links/{id}/payments` → `PROCESSING_PAYMENT`
7. **Backend** processes payment:
   - Success → `COMPLETED`
   - Failure → `FAILED` (with retry option)
   - Network error → `ERROR_RETRYABLE`

### Component Communication
```
CheckoutComponent (Smart)
├── Inputs: paymentLinkId (from route params)
├── State Management: status signal, paymentLink signal, paymentResult signal
└── Children:
    ├── FeeBreakdownComponent (@Input: feePreview, @Input: baseAmount)
    └── PaymentStatusComponent (@Input: status, @Input: result)
```

### Data Models

**File**: `src/models/payment.model.ts`

```typescript
// Fee breakdown structure
interface FeePreview {
  fxRate: number;
  totalFeesUsd: number;
  recipientAmountMxn: number;
  breakdown: {
    fixedFeeUsd: number;
    variableFeeUsd: number;
    fxMarkupUsd: number;
    firstTxDiscountUsd: number;
  };
}

// Payment link response
interface PaymentLinkWithPreviewResponse {
  id: string;
  merchantId: string;
  status: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'COMPLETED' | 'CANCELLED';
  amountUsd: number;
  description: string;
  expiresAt: string | null;
  feePreview: FeePreview;
  // ... other fields
}

// Payment processing request
interface ProcessPaymentRequest {
  cardToken: string;
  pspProvider: 'STRIPE' | 'ADYEN';
  idempotencyKey: string;
  metadata?: { [key: string]: any };
}

// Payment result
interface ProcessPaymentResponse {
  transactionId: string;
  status: 'COMPLETED' | 'FAILED';
  paymentLinkId: string;
  pspProvider: 'STRIPE' | 'ADYEN';
  amountUsd: number;
  recipientAmountMxn: number;
  fxRateApplied: number;
  totalFeesUsd: number;
}
```

---

## 📚 Related Documentation

- **Backend API**: See backend repository for API documentation
- **Frontend Planning**: [`frontend_angular_plan.md`](frontend_angular_plan.md) *(if available)*
- **AI Agent Guidelines**: [`agents.md`](agents.md)
- **Pending Tasks**: [`TASKS.md`](TASKS.md) - See development roadmap

---

## 🎯 Current Status

### ✅ Implemented Features

- ✅ Payment link fetching and rendering
- ✅ Client-side card validation (Luhn algorithm)
- ✅ Mock PSP tokenization
- ✅ Payment processing integration
- ✅ Fee breakdown display
- ✅ Success/failure states
- ✅ Error handling with retry
- ✅ Responsive design
- ✅ GitHub Pages deployment

### 🚧 Pending Improvements

See [`TASKS.md`](TASKS.md) for:
- Testing framework setup
- Linting and code quality tools
- Additional documentation
- Performance optimizations

---

## 🤝 Contributing

This project was built as part of the **Kira Product Engineer Assessment**.

For development:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is part of the Kira technical assessment.

---

## 🙏 Acknowledgments

- Built with Angular 20 and TypeScript
- Designed for PCI DSS compliance
- Part of Kira's cross-border payment solution (USD → MXN)

---

<div align="center">

**Made with ❤️ for Kira**

[⬆ Back to Top](#-kira-payment-links---frontend)

</div>
