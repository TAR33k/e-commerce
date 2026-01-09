<div align="center">
  <h1>
    <font style="font-weight: bold;">E‑Commerce</font>
    <br />
    <font size="5">Full‑Stack Shopping Platform</font>
  </h1>

Modern full‑stack e‑commerce application with authentication, cart, coupons, Stripe checkout, and admin analytics.

  <p>
    <img alt="Frontend" src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-149ECA.svg?style=for-the-badge&logo=react" />
    <img alt="Styling" src="https://img.shields.io/badge/UI-TailwindCSS-38B2AC.svg?style=for-the-badge&logo=tailwindcss" />
    <img alt="Backend" src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933.svg?style=for-the-badge&logo=nodedotjs" />
    <img alt="Database" src="https://img.shields.io/badge/Database-MongoDB-47A248.svg?style=for-the-badge&logo=mongodb" />
    <img alt="Cache" src="https://img.shields.io/badge/Cache-Redis-DC382D.svg?style=for-the-badge&logo=redis" />
    <img alt="Payments" src="https://img.shields.io/badge/Payments-Stripe-635BFF.svg?style=for-the-badge&logo=stripe" />
    <img alt="Media" src="https://img.shields.io/badge/Media-Cloudinary-3448C5.svg?style=for-the-badge&logo=cloudinary" />
  </p>

</div>

---

## About E‑Commerce

**E‑Commerce** is a full‑stack shopping platform focused on:

- **Clean authentication** with email/password, JWTs, and httpOnly cookies.
- **Product catalog management** with featured products, categories, and admin tools.
- **Shopping cart and coupons** with per‑user cart state, discounts, and automatic coupon rewards.
- **Secure payments** using Stripe Checkout Sessions.
- **Admin analytics** with sales, revenue, and daily trends visualized in the UI.

---

## Core Capabilities

### User Authentication & Session Management

- **Email/password signup & login**.
- **Secure JWT‑based authentication**:
  - Short‑lived **access tokens** and long‑lived **refresh tokens**.
  - Tokens are stored in **httpOnly cookies** for better security.
- **Redis‑backed refresh tokens**:
  - Refresh tokens are stored in Redis.
  - A token must match the value stored in Redis to be accepted.
- **Automatic token refresh on the frontend**:
  - An Axios response interceptor calls `/api/auth/refresh-token` on `401` responses.
  - After a successful refresh, the original request is retried.
- **User roles**:
  - `customer` (default).
  - `admin` for admin dashboard and product/analytics management.

### Product Catalog

- **Cloudinary integration** for product images:
  - Images are uploaded to Cloudinary (`products` folder).
  - On product delete, the associated Cloudinary image is also removed.
- **Featured products caching**:
  - Featured products are cached in Redis under the `featured_products` key.
  - Cache is used by `/featured` and updated whenever featured flags change.

### Cart & Coupons

- **Per‑user cart** stored on the `User` document as `cartItems`.
- **Coupons**:
  - Each coupon has `code`, `discountPercentage`, `expirationDate`, `isActive`, and `userId`.
  - Per‑user unique coupon: one active coupon per `userId`.
  - After large purchases (e.g., total >= 200.00 USD), a new coupon is generated and associated with the user.
  - When a paid order uses a coupon, that coupon is deactivated.

### Checkout & Payments (Stripe)

- **Stripe integration** via server‑side Checkout Sessions:
  - The backend uses the official `stripe` SDK with `STRIPE_SECRET_KEY`.
- **Checkout flow**:
  - Frontend collects the cart + optional coupon code and posts to
    `POST /api/payments/create-checkout-session`.
  - Backend constructs `line_items` from the cart and optionally attaches a Stripe coupon.
  - The backend returns the Checkout Session `id`, `url`, and the computed total amount.
  - Frontend redirects the browser to `session.url`.
- **Post‑payment handling**:
  - Stripe Checkout redirects back to the frontend:
    - `success_url`: `<CLIENT_URL>/purchase-success?session_id={CHECKOUT_SESSION_ID}`
    - `cancel_url`: `<CLIENT_URL>/purchase-cancel`
  - On **Purchase Success Page**:
    - Reads the `session_id` from the query string.
    - Calls `POST /api/payments/checkout-success` with the `sessionId`.
  - Backend `checkoutSuccess` controller:
    - Retrieves the Checkout Session from Stripe.
    - Ensures `payment_status === "paid"`.
    - Deactivates any used coupon.
    - Creates an `Order` document from the session metadata and amount.
  - Frontend then clears the cart and shows a success UI.

---

## Tech Stack Overview

### Frontend

- **Framework:** React 19 with Vite.
- **Styling:** TailwindCSS.
- **State Management:** Zustand.
- **Routing:** React Router.
- **HTTP Client:** Axios.
- **Charts & Visuals:**
  - recharts for analytics charts.
  - framer-motion for animations.
  - react-confetti for purchase success celebration.
- **UI/UX Enhancements:** lucide-react icons, react-hot-toast notifications.

### Backend

- **Runtime:** Node.js.
- **Framework:** Express.
- **Database:** MongoDB with Mongoose ODM.
- **Authentication:**
  - JWT‑based access and refresh tokens.
  - httpOnly cookies for token storage.
  - Password hashing with bcryptjs.
  - Role‑based access control via middleware.
- **Caching / Tokens:** Redis (via ioredis) for refresh tokens and featured product cache.
- **Media Storage:** Cloudinary for product images.
- **Payments:** Stripe Checkout Sessions.

---

## Configuration & Environment

### Root `.env`

The project expects a `.env` file at the repository root (example: `.env.example`):

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=<your-mongodb-connection-string>
UPSTASH_REDIS_URL=<your-redis-url>
ACCESS_TOKEN_SECRET=<your-access-token-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
```

---

## Running the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/TAR33k/e-commerce.git
cd e-commerce
```

### 2. Configure Environment Variables

- Create `.env` in the project root from `.env.example` and fill in the values

### 3. Install Dependencies

From the project root:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

### 4. Run in Development Mode

In two terminals:

```bash
# Terminal 1 – Backend (from project root)
npm run dev

# Terminal 2 – Frontend
cd frontend
npm run dev
```

Then open the frontend in your browser:

- **http://localhost:5173/**

---

## Production Build

### 1. Build Frontend

From the project root:

```bash
npm run build
```

### 2. Start Server in Production Mode

Make sure `NODE_ENV=production` and `CLIENT_URL` should point to your deployed frontend URL in production in your `.env`, then from the project root:

```bash
npm start
```
