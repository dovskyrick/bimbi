# 🚀 Quick Reference

## Adding a New Painting

1. Add image to `/admin/paintings-data/images/painting-004.jpg`
2. Create `/admin/paintings-data/metadata/painting-004.yaml`:

```yaml
title: Your Painting Title
price: 500
width: 70
height: 90
medium: oil on canvas
year: 2024
description: |
  Beautiful description here.
  Multiple lines supported.
available: true
```

3. Run upload:
```bash
cd admin
npm run upload
```

4. Refresh your website - new painting appears! ✨

---

## Common Commands

### Admin (Upload Paintings)
```bash
cd admin
npm install          # First time only
npm run upload       # Upload new paintings
```

### Frontend (Development)
```bash
cd web
npm install          # First time only
npm run dev          # Start dev server
npm run build        # Build for production
```

---

## File Locations

| What | Where |
|------|-------|
| Add images | `/admin/paintings-data/images/` |
| Add metadata | `/admin/paintings-data/metadata/` |
| Firebase service account | `/admin/service-account.json` |
| Firebase web config | `/web/src/lib/firebase.ts` |
| Firestore rules | `/firestore.rules` |
| Storage rules | `/storage.rules` |

---

## URLs

- **Dev server:** http://localhost:5173
- **Firebase Console:** https://console.firebase.google.com/
- **Firestore data:** Firebase Console → Firestore Database
- **Storage files:** Firebase Console → Storage

---

## Troubleshooting

**Paintings not showing up?**
1. Check Firebase Console → Firestore Database
2. Verify documents exist in `paintings` collection
3. Check browser console (F12) for errors
4. Verify `firebase.ts` has correct config

**Upload script fails?**
1. Check `service-account.json` exists in `/admin/`
2. Verify YAML filename matches image filename
3. Check all required fields in YAML

**Images not loading?**
1. Check Firebase Console → Storage
2. Verify files exist in `paintings/` folder
3. Check Storage rules allow public read

---

## Next Phase

Ready for Phase 2 (Shopping Cart)?

Let me know and I'll add:
- 🛒 Cart functionality
- 💾 Cart persistence
- 🎨 Cart UI components

