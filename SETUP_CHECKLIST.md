# ✅ Setup Checklist

Print this or keep it open while setting up!

---

## 🔥 Firebase Setup

- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Create new project: "bimbi-art-gallery"
- [ ] Disable Google Analytics
- [ ] Enable Firestore Database (production mode, europe-west1)
- [ ] Enable Firebase Storage (production mode, europe-west1)
- [ ] Deploy Firestore rules (copy from `/firestore.rules`)
- [ ] Deploy Storage rules (copy from `/storage.rules`)
- [ ] Download service account key → save as `/admin/service-account.json`
- [ ] Register web app → copy `firebaseConfig` object

---

## 🖼️ Prepare Paintings

- [ ] Add images to `/admin/paintings-data/images/`
- [ ] Edit `A.yaml` with real painting details
- [ ] Edit `B.yaml` with real painting details
- [ ] Edit `C.yaml` with real painting details
- [ ] (Optional) Add more paintings with matching YAML files

---

## 🚀 Admin Script

- [ ] Open terminal
- [ ] `cd admin`
- [ ] `npm install`
- [ ] Verify `service-account.json` exists in this folder
- [ ] `npm run upload`
- [ ] ✅ See success message with uploaded count

---

## 🌐 Frontend Setup

- [ ] Open `/web/src/lib/firebase.ts`
- [ ] Replace placeholder config with your `firebaseConfig`
- [ ] Save file
- [ ] Open terminal
- [ ] `cd web`
- [ ] `npm install`
- [ ] `npm run dev`
- [ ] Open http://localhost:5173
- [ ] ✅ See your paintings in the gallery!

---

## 🧪 Testing

- [ ] Gallery page loads
- [ ] All 3 paintings visible
- [ ] Click a painting → detail page opens
- [ ] Full-size image displays
- [ ] Price and details show correctly
- [ ] Back button returns to gallery
- [ ] Test on mobile (resize browser)
- [ ] Check browser console (F12) - no errors

---

## 🎉 Success Criteria

You should see:
- ✅ Gallery grid with thumbnail images
- ✅ Painting titles and prices
- ✅ Click opens detail page
- ✅ Full-size image on detail page
- ✅ All metadata displays correctly
- ✅ Responsive design works

---

## 🐛 If Something Goes Wrong

### Admin script fails
1. Check `service-account.json` exists in `/admin/`
2. Check YAML filenames match image filenames
3. Check all required YAML fields are present

### Frontend shows no paintings
1. Open browser console (F12) - check for errors
2. Verify Firebase config in `firebase.ts` is correct
3. Check Firebase Console → Firestore → verify documents exist
4. Check Firestore rules allow public read

### Images don't load
1. Check Firebase Console → Storage → verify files exist
2. Check Storage rules allow public read
3. Check browser Network tab (F12) for failed requests

---

## 📞 Need Help?

1. Check [`GETTING_STARTED.md`](./GETTING_STARTED.md) for detailed instructions
2. Check [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md) for common commands
3. Check browser console (F12) for error messages
4. Check Firebase Console for data

---

## ✨ All Done?

Congratulations! 🎉 You now have a working art gallery website!

**Next:** When ready, we'll add Phase 2 (Shopping Cart) 🛒


