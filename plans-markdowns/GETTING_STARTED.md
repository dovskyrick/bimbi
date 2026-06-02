# 🎨 Bimbi Gallery - Getting Started Guide

Complete setup guide for Phase 1 (Gallery + Admin Script).

---

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase account (free tier is fine)
- Your painting images ready

---

## 🔥 Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Project name: `bimbi-art-gallery` (or your choice)
4. Disable Google Analytics (not needed)
5. Click **"Create project"**

### 1.2 Enable Firestore Database

1. In Firebase Console → **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Select location: **europe-west1** (Belgium - closest to Portugal)
5. Click **"Enable"**

### 1.3 Enable Firebase Storage

1. Go to **Build** → **Storage**
2. Click **"Get started"**
3. Choose **"Start in production mode"**
4. Use same location: **europe-west1**
5. Click **"Done"**

### 1.4 Deploy Security Rules

1. In Firestore → **Rules** tab
2. Copy content from `/firestore.rules` in this repo
3. Paste and click **"Publish"**

4. In Storage → **Rules** tab
5. Copy content from `/storage.rules` in this repo
6. Paste and click **"Publish"**

### 1.5 Get Service Account Key (for Admin Script)

1. Go to **Project Settings** (gear icon) → **Service Accounts**
2. Click **"Generate new private key"**
3. Click **"Generate key"** - downloads a JSON file
4. Rename it to `service-account.json`
5. Move it to `/admin/` folder
6. ⚠️ **NEVER commit this file to git!** (already in .gitignore)

### 1.6 Get Web App Config (for Frontend)

1. Go to **Project Settings** → **General**
2. Scroll to **"Your apps"**
3. Click the **Web** icon (`</>`)
4. Register app nickname: `bimbi-web`
5. Don't check "Firebase Hosting" yet
6. Click **"Register app"**
7. Copy the `firebaseConfig` object (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 🖼️ Step 2: Prepare Your Paintings

### 2.1 Add Images

1. Put your painting images in: `/admin/paintings-data/images/`
2. Use simple filenames: `painting-001.jpg`, `painting-002.jpg`, etc.
3. Supported formats: JPG, PNG, WebP
4. Recommended: High resolution (2000px+ on longest side)

### 2.2 Create Metadata Files

For each image, create a matching YAML file in `/admin/paintings-data/metadata/`:

Example: `/admin/paintings-data/metadata/painting-001.yaml`

```yaml
title: Sunset Over Lisbon
price: 450
width: 60
height: 80
medium: oil on canvas
year: 2024
description: |
  A vibrant sunset captured from the hills of Alfama.
  Warm oranges and deep purples blend into the Tagus River.
available: true
```

**Note:** You already have `A.yaml`, `B.yaml`, `C.yaml` - edit these with real details!

---

## 🚀 Step 3: Upload Paintings to Firebase

### 3.1 Install Admin Dependencies

```bash
cd admin
npm install
```

### 3.2 Run Upload Script

```bash
npm run upload
```

This will:
- ✅ Read all images from `paintings-data/images/`
- ✅ Read matching YAML files
- ✅ Upload full-size images to Firebase Storage
- ✅ Generate and upload thumbnails (400px wide)
- ✅ Create Firestore documents with all metadata

You should see output like:

```
🎨 Bimbi Paintings Uploader

Found 3 image(s) to process

📷 Processing: A
  → Reading metadata...
  → Reading image file...
  → Generating thumbnail...
  → Uploading full image...
  → Uploading thumbnail...
  → Saving to Firestore...
  ✅ Successfully uploaded: Painting A

...

==================================================
✅ Uploaded: 3
⏭️  Skipped: 0
==================================================
```

---

## 🌐 Step 4: Configure & Run Frontend

### 4.1 Add Firebase Config

1. Open `/web/src/lib/firebase.ts`
2. Replace the placeholder config with your actual config from Step 1.6
3. Save the file

### 4.2 Install Frontend Dependencies

```bash
cd web
npm install
```

### 4.3 Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser! 🎉

You should see:
- Gallery grid with your 3 paintings
- Click any painting to see detail page
- Full-size image, price, dimensions, description

---

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Firestore enabled and rules deployed
- [ ] Storage enabled and rules deployed
- [ ] Service account key downloaded and placed in `/admin/`
- [ ] Images added to `/admin/paintings-data/images/`
- [ ] YAML metadata files created for each image
- [ ] Admin script ran successfully
- [ ] Firebase config added to `/web/src/lib/firebase.ts`
- [ ] Frontend running on localhost:5173
- [ ] Gallery displays paintings
- [ ] Detail pages work

---

## 🐛 Troubleshooting

### Admin Script Issues

**"Cannot find module 'service-account.json'"**
- Make sure `service-account.json` is in `/admin/` folder
- Check filename is exactly `service-account.json`

**"Permission denied" errors**
- Check service account has correct permissions
- Regenerate the service account key if needed

**"No metadata file found"**
- Ensure YAML filename matches image filename (without extension)
- Example: `A.jpg` needs `A.yaml`

### Frontend Issues

**"Firebase: Error (auth/invalid-api-key)"**
- Check you replaced the placeholder config in `firebase.ts`
- Verify API key is correct from Firebase Console

**"No paintings displayed"**
- Open browser console (F12) and check for errors
- Verify Firestore rules allow public read access
- Check paintings were uploaded successfully (Firebase Console → Firestore)

**Images not loading**
- Verify Storage rules allow public read access
- Check image URLs in Firestore documents
- Open Network tab in browser DevTools

---

## 🎯 Next Steps

Phase 1 is complete! You now have:
- ✅ Working admin script to upload paintings
- ✅ Beautiful gallery website
- ✅ Individual painting detail pages

Ready for Phase 2? We'll add:
- 🛒 Shopping cart
- 💳 Stripe checkout
- 🔒 Reservation system

---

## 📁 Project Structure

```
bimbi/
├── admin/                          # Admin scripts
│   ├── paintings-data/
│   │   ├── images/                # Put your images here
│   │   │   ├── A.jpg
│   │   │   ├── B.jpg
│   │   │   └── C.jpg
│   │   └── metadata/              # Put YAML files here
│   │       ├── A.yaml
│   │       ├── B.yaml
│   │       └── C.yaml
│   ├── upload-paintings.ts        # Upload script
│   ├── package.json
│   └── service-account.json       # SECRET - don't commit!
│
├── web/                           # Frontend website
│   ├── src/
│   │   ├── lib/
│   │   │   └── firebase.ts        # Add your config here!
│   │   ├── pages/
│   │   │   ├── Gallery.tsx
│   │   │   └── PaintingDetail.tsx
│   │   └── ...
│   └── package.json
│
├── firestore.rules                # Firestore security rules
├── storage.rules                  # Storage security rules
└── GETTING_STARTED.md            # This file!
```

---

Need help? Check the individual README files in `/admin` and `/web` folders!


