# Firebase Setup Guide

Follow these steps to set up Firebase for your Bimbi art gallery.

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it (e.g., "bimbi-art-gallery")
4. Disable Google Analytics (not needed for now)
5. Click "Create project"

## 2. Enable Firestore Database

1. In Firebase Console, go to **Build → Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (we'll set rules later)
4. Select a location close to Portugal (e.g., `europe-west1` - Belgium)
5. Click "Enable"

## 3. Enable Firebase Storage

1. Go to **Build → Storage**
2. Click "Get started"
3. Choose **Production mode**
4. Use the same location as Firestore
5. Click "Done"

## 4. Get Service Account Key (for admin script)

1. Go to **Project Settings** (gear icon) → **Service Accounts**
2. Click "Generate new private key"
3. Click "Generate key" - a JSON file will download
4. Rename it to `service-account.json`
5. Move it to the `/admin` folder
6. **IMPORTANT:** This file is secret! Never commit it to git (already in .gitignore)

## 5. Get Firebase Config (for web app)

1. Go to **Project Settings** → **General**
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register app with nickname "bimbi-web"
5. Copy the `firebaseConfig` object
6. We'll add this to the React app in the next step

## 6. Install Admin Dependencies

```bash
cd admin
npm install
```

## 7. Upload Your Paintings

```bash
npm run upload
```

This will:
- Read all images from `paintings-data/images/`
- Read matching YAML files from `paintings-data/metadata/`
- Upload images and thumbnails to Firebase Storage
- Create documents in Firestore

## Next Steps

Once the admin script works, we'll build the React frontend to display the gallery!

