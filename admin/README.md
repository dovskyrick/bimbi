# Bimbi Admin Scripts

Admin tools to manage the paintings database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Get Firebase service account key:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `service-account.json` in this directory

## Adding a New Painting

1. Add your image to `paintings-data/images/`
   - Use a simple filename like `painting-001.jpg`
   - Supported formats: JPG, PNG, WebP
   - Recommended: high resolution (at least 2000px on longest side)

2. **(Optional)** Create a matching YAML file in `paintings-data/metadata/`
   - Same filename as image: `painting-001.yaml`
   - Copy the template from `_template.yaml`
   - Fill in the details you want (all fields optional!)
   - **If no YAML exists:** Defaults will be used (Untitled, €100, etc.)

3. Run the upload script:
```bash
npm run upload
```

The script will:
- Upload the full-size image to Firebase Storage
- Generate and upload a thumbnail (400px wide)
- Add the painting to Firestore with metadata
- **Move files to `uploaded/` folder** for local backup

## Workflow

```
paintings-data/
├── images/              ← Put new images here
├── metadata/            ← Put YAML files here (optional)
└── uploaded/            ← Uploaded files automatically moved here
    ├── images/          ← Backup of uploaded images
    └── metadata/        ← Backup of uploaded YAML files
```

**After running upload:**
- ✅ Files moved to `uploaded/` folder
- ✅ Local backup kept on your computer
- ✅ Won't re-upload same files
- ✅ `images/` and `metadata/` folders ready for new paintings

## YAML Format

See `paintings-data/metadata/_template.yaml` for the template.

**All fields are optional!** Defaults if missing:
- `title` → "Untitled"
- `description` → "No description available"
- `price` → 100
- `medium` → "Unknown"
- `width/height` → Auto-detected from image (rough estimate)
- `year` → Current year
- `available` → true

Example with all fields:
```yaml
title: Sunset Over Lisbon
price: 450
width: 60
height: 80
medium: oil on canvas
year: 2024
description: |
  A beautiful painting description.
  Multiple lines supported.
available: true
```

## Tips

- **No YAML needed!** Just drop images in `images/` folder and run upload
- Files are automatically backed up in `uploaded/` folder
- Only new files (not in `uploaded/`) will be processed
- You can add metadata later by creating a YAML and re-uploading
