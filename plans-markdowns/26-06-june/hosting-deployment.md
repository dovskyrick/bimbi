# Hosting on Firebase + dovsky.com

## 1. Add Firebase Hosting to firebase.json

Update `/home/rbbs/Dev/bimbi/firebase.json` to include hosting:

```json
{
  "firestore": { "rules": "firestore.rules" },
  "storage": { "rules": "storage.rules" },
  "hosting": {
    "public": "web/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

## 2. Build and deploy

```bash
cd /home/rbbs/Dev/bimbi/web
npm run build

cd /home/rbbs/Dev/bimbi
firebase deploy --only hosting
```

Firebase gives you a live URL like `https://bimbi-749b2.web.app`. Confirm it works before touching the domain.

## 3. Add dovsky.com in Firebase Console

Go to Firebase Console → Hosting → **Add custom domain** → type `dovsky.com`.
Firebase shows you two DNS records to add (usually two A records).

## 4. Add the DNS records in Namecheap

Go to Namecheap → **Domain List** → dovsky.com → **Manage** → **Advanced DNS** → add the A records Firebase gave you.

Also add a `www` CNAME record pointing to `bimbi-749b2.web.app` if you want `www.dovsky.com` to work too.

## 5. Wait for propagation

DNS takes 15 minutes to a few hours. Firebase auto-provisions an SSL certificate once it sees the records. No action needed — just wait and refresh.

## Notes
- Firebase Hosting free tier is generous (10 GB storage, 360 MB/day transfer). More than enough for a gallery.
- `dovsky.com` must not have existing A records pointing elsewhere, or you'll need to remove them first in Namecheap.
