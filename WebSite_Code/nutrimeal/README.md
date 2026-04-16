# 🥗 NutriMeal — Full-Stack Meal Planning App

A React-based meal planning and nutrition tracking web app with AI chatbot, PubMed integration, order tracking, and personalized meal plan generation.

---

## 🚀 Quick Start in VS Code

### 1. Prerequisites
- [Node.js 18+](https://nodejs.org)
- VS Code with the **ES7+ React/Redux/React-Native** extension (optional but helpful)

### 2. Install & Run
```bash
cd nutrimeal
npm install
npm start
```
The app opens at **http://localhost:3000**

---

## 🔑 API Key Setup

The AI Chatbot uses the Anthropic Claude API. To enable it:

1. Create a `.env` file in the project root:
```
REACT_APP_ANTHROPIC_API_KEY=sk-ant-...your-key-here...
```

2. Update `src/services/api.js` → `chatWithClaude()` to add the auth header:
```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
},
```

> ⚠️ For production, proxy API calls through a backend server to protect your key.

---

## 📦 Project Structure

```
nutrimeal/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx                  # Root with React Router
│   ├── index.js                 # Entry point
│   ├── context/
│   │   ├── AppContext.jsx       # Cart, orders, notifications (persisted)
│   │   └── AuthContext.jsx      # User auth and profile
│   ├── services/
│   │   └── api.js               # All API integrations + mock data
│   ├── components/
│   │   └── Navbar.jsx           # Responsive navigation
│   ├── pages/
│   │   ├── ShopPage.jsx         # Browse items, filter, add to cart
│   │   ├── CartPage.jsx         # Cart management, quantities, totals
│   │   ├── CheckoutPage.jsx     # Delivery/pickup, address, payment
│   │   ├── OrdersPage.jsx       # Order history, tracking, cancel, rate
│   │   ├── NutritionPage.jsx    # Macro tracking + PubMed search
│   │   ├── ChatbotPage.jsx      # Claude AI assistant
│   │   ├── ProfilePage.jsx      # Goals, dietary, preferences, support
│   │   ├── AdminPage.jsx        # Meal plan algorithm
│   │   └── LoginPage.jsx        # Auth
│   └── styles/
│       └── global.css           # Design system tokens + all styles
└── package.json
```

---

## ✅ Feature Checklist

### Sprint 1 — Shop & Cart
- [x] Item prices with pictures
- [x] Add items to cart
- [x] Remove items from cart
- [x] Change item quantity
- [x] PubMed integration (Nutrition page)
- [x] AI Chatbot for web info aggregation
- [x] DoorDash/Kroger delivery option (UI + simulation)
- [x] Mobile responsive

### Sprint 2 — Checkout
- [x] See total price in cart
- [x] Choose delivery/pickup option
- [x] Enter delivery address
- [x] Choose payment method (card, Apple Pay)
- [x] See order confirmation
- [x] Secure data storage (localStorage + no PII in API calls)

### Sprint 3 — Orders
- [x] Track order status (Confirmed → Preparing → Out for Delivery → Delivered)
- [x] See order history
- [x] Cancel order
- [x] Receive order notifications (simulated every 8 seconds)
- [x] Rate items/service (star rating)

### Sprint 4 — Nutrition
- [x] Track macro/micronutrients (calories, protein, carbs, fat, fiber)
- [x] Positive reinforcement messages
- [x] Incentive toasts for meeting goals
- [x] Handle dietary restrictions (vegan, gluten-free, allergies)
- [x] Place order from meal plan

### Sprint 5 — Profile & Admin
- [x] Account deletion
- [x] Edit profile/goals/requirements
- [x] Edit food preferences
- [x] Contact support form
- [x] Admin meal plan algorithm

---

## 🏗️ Backend Integration Guide

This frontend is ready to connect to a REST API. Replace mock functions in `src/services/api.js`:

### Suggested Endpoints
```
POST   /auth/login
GET    /products
POST   /orders
GET    /orders/:userId
PATCH  /orders/:id/cancel
POST   /users/:id/rate
GET    /users/:id/profile
PATCH  /users/:id/profile
DELETE /users/:id
```

### DoorDash API Integration
1. Register at [DoorDash Developer Portal](https://developer.doordash.com)
2. Add credentials to `.env`: `REACT_APP_DOORDASH_KEY=...`
3. Replace `simulateOrderProgress()` with real DoorDash delivery tracking

### Kroger API Integration
1. Register at [developer.kroger.com](https://developer.kroger.com)
2. Use OAuth 2.0 for product catalog and fulfillment APIs

---

## 🔒 Security Notes

- Payment forms are frontend-only (demo). In production:
  - Use **Stripe.js** for PCI-compliant card handling
  - Never pass raw card numbers to your own backend
- User data is stored in `localStorage` (no server). In production, use JWT + HTTPS API
- The Anthropic API key must be server-side in production

---

## 📱 Mobile
The app is fully responsive with breakpoints at 768px. All pages stack vertically on mobile.

---

## 🧪 Testing

```bash
npm test    # Runs Jest + React Testing Library
```

Key areas to test:
- Cart reducer (add/remove/update quantity)
- Meal plan algorithm (dietary filters, calorie targeting)
- Order state transitions
- PubMed search error handling
