# 🎨 Bimbi - Art Gallery E-Commerce

A beautiful, minimal e-commerce website for selling original oil paintings.

## 🚀 Quick Start

**New here?** → Read [`GETTING_STARTED.md`](./GETTING_STARTED.md) for complete setup instructions!

## 📦 What's Included

### Phase 1 (Current) ✅
- **Admin Script** - Upload paintings via YAML metadata files
- **Gallery Website** - Display paintings in a beautiful grid
- **Detail Pages** - Full-size images with descriptions
- **Firebase Integration** - Firestore + Storage

### Phase 2 (Coming Soon)
- Shopping cart
- Stripe checkout
- Payment confirmation
- Reservation system

## 🛠️ Tech Stack

- **Frontend:** Vite + React + TypeScript
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage
- **Hosting:** Firebase Hosting (Phase 4)
- **Payments:** Stripe Checkout (Phase 3)
- **Backend:** Firebase Cloud Functions (Phase 3)

## 📁 Project Structure

```
bimbi/
├── admin/              # Admin scripts to manage paintings
├── web/                # React frontend website
├── firestore.rules     # Database security rules
├── storage.rules       # Storage security rules
└── GETTING_STARTED.md  # Setup guide
```

## 🎯 Development Phases

### ✅ Phase 1: Gallery + Admin Script
- Gallery page with paintings grid
- Painting detail pages
- Admin script to upload paintings from YAML files
- Firebase Firestore + Storage setup

### 🔜 Phase 2: Shopping Cart
- Client-side cart state management
- Add/remove paintings from cart
- Cart persistence (localStorage)
- Cart UI components

### 🔜 Phase 3: Checkout & Payments
- Firebase Cloud Functions
- Stripe Checkout integration (EUR, card + MB WAY)
- Reservation system (prevent race conditions)
- Webhook handlers for payment confirmation

### 🔜 Phase 4: Deploy & Polish
- Firebase Hosting deployment
- Custom domain setup
- Performance optimization
- Final UI polish

## 📖 Documentation

- [`GETTING_STARTED.md`](./GETTING_STARTED.md) - Complete setup guide
- [`admin/README.md`](./admin/README.md) - Admin script documentation
- [`admin/SETUP.md`](./admin/SETUP.md) - Firebase setup instructions
- [`web/README.md`](./web/README.md) - Frontend documentation

## 🎨 Design Philosophy

- Minimal, clean aesthetic (art gallery feel)
- Typography-focused design
- Generous white space
- Fast, responsive, accessible
- No unnecessary features

## 🇵🇹 Portugal Market

- Currency: EUR (€)
- Payment methods: Card + MB WAY
- Language: English (can be localized later)

## 📝 License

See [LICENSE](./LICENSE) file.

---

**Ready to start?** → [`GETTING_STARTED.md`](./GETTING_STARTED.md)
