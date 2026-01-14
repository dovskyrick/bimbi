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

2. Create a matching YAML file in `paintings-data/metadata/`
   - Same filename as image: `painting-001.yaml`
   - Copy the example template
   - Fill in all the details

3. Run the upload script:
```bash
npm run upload
```

The script will:
- Upload the full-size image to Firebase Storage
- Generate and upload a thumbnail (400px wide)
- Add the painting to Firestore with all metadata

## YAML Format

See `paintings-data/metadata/example-painting-001.yaml` for the template.

Required fields:
- `title` - Painting title
- `price` - Price in euros (number)
- `width` - Width in cm
- `height` - Height in cm
- `medium` - Medium used (e.g., "Oil on canvas")
- `year` - Year created
- `description` - Description text

Optional fields:
- `tags` - Array of tags
- `available` - Defaults to `true`
