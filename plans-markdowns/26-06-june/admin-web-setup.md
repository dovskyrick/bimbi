# Admin Web — Setup Instructions

## How access control works

Security is enforced by Firebase Security Rules using your **Firebase UID** — an opaque identifier
that Firebase assigns to your Google account. No email is stored anywhere in the codebase.
The UID is safe to commit (it is meaningless without a valid signed Firebase token).

---

## Step 1 — Enable Google sign-in in Firebase Console

Go to [Firebase Console](https://console.firebase.google.com) → your project →
**Authentication → Sign-in method** → enable **Google**.

---

## Step 2 — Add localhost to authorised domains

Same console → **Authentication → Settings → Authorized domains** → confirm `localhost` is listed.
(It is usually there by default — just check.)

---

## Step 3 — Install and run the app for the first time

```bash
cd /home/rbbs/Dev/bimbi/admin-web
npm install
npm run dev
```

Open `http://localhost:5174` and sign in with your Google account.

---

## Step 4 — Get your UID

Go to [Firebase Console](https://console.firebase.google.com) → your project →
**Authentication → Users**.

You will see your account listed after the first sign-in. Copy the value in the **User UID** column.
It looks something like `7fKx9mQpL2AbCdEf...`.

---

## Step 5 — Fill in your UID in the rules files

In `/home/rbbs/Dev/bimbi/firestore.rules` — replace `YOUR_UID_HERE` with your UID.

In `/home/rbbs/Dev/bimbi/storage.rules` — replace `YOUR_UID_HERE` with the same UID.

Both files are fully committable — a UID contains no personal information.

---

## Step 6 — Deploy the security rules

```bash
cd /home/rbbs/Dev/bimbi
firebase deploy --only firestore:rules,storage
```

---

## Step 7 — You're done

Reload `http://localhost:5174`, sign in, and the editable gallery is live.
Any write attempt from a different Google account will be rejected by Firebase directly.
