# SmartBanao – Full-Stack Digital Products & Online Courses Platform

> **"Learn Smart. Create More. Achieve More."**

SmartBanao is a production-grade full-stack digital products selling platform tailored for Indian creators, developers, and learners. It provides an end-to-end e-commerce experience for PDFs, e-books, video courses, design templates, and curated digital bundles with cryptographic server-side payment verification.

---

## 🌟 Key Architectural Features

- **One-Time Digital Purchases**: Zero recurring subscriptions or hidden renewals. Customers buy Bundle A, Bundle B, or individual digital products once and receive perpetual lifetime licenses.
- **Cryptographic Server-Side Payment Verification**:
  - Validates catalog prices on the server (never trusts client-submitted amounts).
  - Indian Payment Gateway integration (Razorpay / UPI / Cards / NetBanking).
  - Verifies HMAC SHA-256 signatures server-side before granting digital access.
  - Idempotent webhook receiver (`/api/payments/webhook`) prevents duplicate fulfillment.
- **Private Storage & Time-Limited Signed Downloads**:
  - Secure `/api/download/:productId` endpoint checks user authorization before serving digital streams with `Content-Disposition: attachment`.
  - Unauthorized visitors receive a strict `403 Forbidden`.
- **Integrated Video Course Player**:
  - Two-column responsive player layout with syllabus drawer.
  - Module and lesson organization with free preview lesson support.
  - Video lesson completion tracking and progress persistence per user.
- **Protected Admin Control Panel (`/admin`)**:
  - Secured on the server with role-based session verification.
  - Dashboard analytics (sales revenue in ₹ INR, paid orders count, catalog stats).
  - Product CRUD, pricing management, and draft/published controls.
  - Bundle builder with multi-product selection and package discount computation.
  - Customer review moderation and website promotional banner controls.
- **Mobile-First Responsive Design**:
  - Adheres to the Universal Frontend Design Constitution (60-30-10 color allocation, zero-pill metadata discipline, WCAG AA contrast).
  - 2 products per row on mobile screens, large touch targets, and zero horizontal overflow.
  - Strict top-bar navigation contract and mobile drawer.

---

## 🚀 Pre-Configured Test Accounts

The platform is seeded with instant demo profiles for review and testing:

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Administrator** | `admin@smartbanao.com` | `admin123` | Full access to `/admin` dashboard, catalog management, orders, review moderation |
| **Learner (Vikram)** | `learner@smartbanao.com` | `learner123` | Pre-granted access to **Bundle A** (Playbook & Blueprint) for immediate library inspection |

*(You can also click the 1-click demo buttons in the Sign-In modal to populate these credentials instantly!)*

---

## 📦 Database Schema (14 Tables with Row Level Security)

Located in `supabase/migrations/20261019_smartbanao_schema.sql`:

1. `profiles`: User account details, role (`customer` vs `admin`).
2. `products`: Digital products (PDFs, e-books, video courses, templates, ZIP packs).
3. `bundles`: Curated package deals (Bundle A, Bundle B, custom bundles).
4. `bundle_items`: Products included within bundles.
5. `courses`: Video course metadata and instructors.
6. `course_modules`: Structured sections within courses.
7. `course_lessons`: Video URLs, durations, and free preview flags.
8. `orders`: Order numbers, customer details, and payment statuses.
9. `order_items`: Line items with snapshot unit prices.
10. `payments`: Gateway transaction IDs and cryptographic signatures.
11. `user_product_access`: Permanent authorization records granted upon verified payment.
12. `lesson_progress`: User lesson completion state and watch percentages.
13. `reviews`: Real customer feedback moderated by administrators.
14. `site_settings`: Store name, support contact, and promotional banner settings.

---

## 🛠 Local Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and configure your credentials:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```
The full-stack Express & Vite server will start on port `3000`.

---

## 📚 Documentation Guides

- [Supabase Setup & Migrations](SUPABASE_SETUP.md)
- [Payment Gateway & Webhook Integration](PAYMENT_GATEWAY_SETUP.md)
- [Vercel Deployment Guide](VERCEL_DEPLOYMENT.md)
