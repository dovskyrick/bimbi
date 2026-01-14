# 🎨 Welcome to Bimbi Gallery!

## 👋 Start Here

This is your complete art gallery e-commerce system. **Phase 1** is fully implemented and ready to use!

---

## 🚀 What to Do Next

### Step 1: Read This First
📖 **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Complete setup guide (15 minutes)

### Step 2: Use This as Reference
✅ **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Step-by-step checklist

### Step 3: Keep This Handy
⚡ **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Common commands

---

## 📚 All Documentation

| Document | Purpose |
|----------|---------|
| **[START_HERE.md](./START_HERE.md)** | You are here! |
| **[GETTING_STARTED.md](./GETTING_STARTED.md)** | Complete setup instructions |
| **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** | Step-by-step checklist |
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Quick commands & tips |
| **[PHASE_1_COMPLETE.md](./PHASE_1_COMPLETE.md)** | What was built |
| **[README.md](./README.md)** | Project overview |
| **[admin/README.md](./admin/README.md)** | Admin script docs |
| **[web/README.md](./web/README.md)** | Frontend docs |

---

## ⚡ Quick Start (TL;DR)

```bash
# 1. Set up Firebase (see GETTING_STARTED.md for details)
#    - Create project
#    - Get service-account.json
#    - Get firebase config

# 2. Upload paintings
cd admin
npm install
npm run upload

# 3. Run website
cd ../web
npm install
npm run dev

# 4. Open http://localhost:5173
```

---

## 🎯 What You Get

### Admin System
- Simple YAML files for painting metadata
- Automatic image upload to Firebase
- Automatic thumbnail generation
- One command to upload everything

### Gallery Website
- Beautiful minimal design
- Responsive (mobile + desktop)
- Gallery grid view
- Individual painting pages
- Available vs Sold sections

---

## 📁 Project Structure

```
bimbi/
├── admin/              # Upload paintings here
│   ├── paintings-data/
│   │   ├── images/     # Add your images
│   │   └── metadata/   # Add YAML files
│   └── upload-paintings.ts
│
└── web/                # Your website
    └── src/
        ├── pages/      # Gallery & Detail pages
        ├── hooks/      # Firebase integration
        └── lib/        # Firebase config
```

---

## 🎨 Your 3 Test Paintings

You already have 3 test images (A, B, C) ready to go!

**Before uploading:**
1. Edit `/admin/paintings-data/metadata/A.yaml` with real details
2. Edit `/admin/paintings-data/metadata/B.yaml` with real details
3. Edit `/admin/paintings-data/metadata/C.yaml` with real details

**Or:** Replace them with your own paintings!

---

## ✨ Features

- ✅ Gallery grid with thumbnails
- ✅ Click to view full painting
- ✅ Price, dimensions, description
- ✅ Available vs Sold status
- ✅ Responsive design
- ✅ Fast loading
- ✅ Clean, minimal aesthetic

---

## 🔜 Coming in Phase 2

- 🛒 Shopping cart
- 💳 Stripe checkout
- 🔒 Reservation system
- 📧 Order confirmation

---

## 🆘 Need Help?

1. **Setup issues?** → [GETTING_STARTED.md](./GETTING_STARTED.md)
2. **Quick commands?** → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
3. **What was built?** → [PHASE_1_COMPLETE.md](./PHASE_1_COMPLETE.md)

---

## 🎉 Ready?

**Go to:** [GETTING_STARTED.md](./GETTING_STARTED.md)

Let's get your gallery online! 🚀

