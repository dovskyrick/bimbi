# Admin Web — Setup Instructions

## 1. Fill in your email in two places

In `/home/rbbs/Dev/bimbi/admin-web/.env.local` — replace `your@email.com` with your actual Google account email.

In both `/home/rbbs/Dev/bimbi/firestore.rules` and `/home/rbbs/Dev/bimbi/storage.rules` — replace `ADMIN_EMAIL_HERE` with that same email.

---

## 2. Deploy the security rules to Firebase

```bash
cd /home/rbbs/Dev/bimbi
firebase deploy --only firestore:rules,storage
```

---

## 3. Add localhost:5174 to Firebase Auth authorized domains

Go to [Firebase Console](https://console.firebase.google.com) → your project → **Authentication** → **Settings** → **Authorized domains** → Add `localhost`.

(It may already be there — just check.)

---

## 4. Enable Google sign-in provider

Same console → **Authentication** → **Sign-in method** → Enable **Google**.

---

## 5. Install and run

```bash
cd /home/rbbs/Dev/bimbi/admin-web
npm install
npm run dev
```

Then open `http://localhost:5174`. You'll see the login screen, sign in with Google, and land on the editable gallery.
