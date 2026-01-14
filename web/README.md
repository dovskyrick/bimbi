# Bimbi Gallery - Frontend

React + TypeScript + Vite frontend for the art gallery.

## Setup

### 1. Configure Firebase

Edit `src/lib/firebase.ts` and replace the placeholder config with your Firebase project config:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings → General
4. Scroll to "Your apps" → Web app
5. Copy the `firebaseConfig` object
6. Paste it into `src/lib/firebase.ts`

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

### 4. Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

## Project Structure

```
src/
├── lib/
│   └── firebase.ts          # Firebase configuration
├── hooks/
│   └── usePaintings.ts      # Custom hooks for Firestore
├── pages/
│   ├── Gallery.tsx          # Main gallery page
│   ├── Gallery.css
│   ├── PaintingDetail.tsx   # Individual painting page
│   └── PaintingDetail.css
├── types/
│   └── painting.ts          # TypeScript interfaces
├── App.tsx                  # Main app with routing
└── main.tsx                 # Entry point
```

## Features

- 🎨 Gallery grid view with thumbnails
- 🖼️ Individual painting detail pages
- 📱 Responsive design
- ⚡ Fast loading with lazy images
- 🎯 Clean, minimal art gallery aesthetic
- 🔍 Separate available and sold sections

## Next Steps (Phase 2)

- Add shopping cart
- Checkout integration with Stripe
