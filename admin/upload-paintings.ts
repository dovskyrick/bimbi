#!/usr/bin/env tsx
import * as admin from 'firebase-admin';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, 'service-account.json');

try {
  const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: serviceAccount.project_id + '.appspot.com'
  });
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Error: service-account.json not found.');
  console.error('Please download your Firebase service account key and save it as admin/service-account.json');
  process.exit(1);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

interface PaintingMetadata {
  title: string;
  price: number;
  width: number;
  height: number;
  medium: string;
  year: number;
  description: string;
  available: boolean;
}

interface PaintingDocument extends PaintingMetadata {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  status: 'available' | 'reserved' | 'sold';
  reservedUntil?: admin.firestore.Timestamp;
}

const PAINTINGS_DATA_DIR = path.join(__dirname, 'paintings-data');
const IMAGES_DIR = path.join(PAINTINGS_DATA_DIR, 'images');
const METADATA_DIR = path.join(PAINTINGS_DATA_DIR, 'metadata');

async function generateThumbnail(imageBuffer: Buffer): Promise<Buffer> {
  return sharp(imageBuffer)
    .resize(400, 400, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 85 })
    .toBuffer();
}

async function uploadImage(
  filePath: string,
  destinationPath: string
): Promise<string> {
  const fileBuffer = await fs.readFile(filePath);
  const file = bucket.file(destinationPath);
  
  await file.save(fileBuffer, {
    metadata: {
      contentType: 'image/jpeg',
      cacheControl: 'public, max-age=31536000',
    },
  });

  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
}

async function processPainting(paintingId: string): Promise<void> {
  console.log(`\n📸 Processing: ${paintingId}`);

  // Find image file (support jpg, jpeg, png)
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
  let imagePath: string | null = null;
  
  for (const ext of imageExtensions) {
    const testPath = path.join(IMAGES_DIR, paintingId + ext);
    try {
      await fs.access(testPath);
      imagePath = testPath;
      break;
    } catch {
      continue;
    }
  }

  if (!imagePath) {
    console.error(`  ❌ Image not found for ${paintingId}`);
    return;
  }

  // Read metadata
  const metadataPath = path.join(METADATA_DIR, `${paintingId}.yaml`);
  let metadata: PaintingMetadata;
  
  try {
    const metadataContent = await fs.readFile(metadataPath, 'utf8');
    metadata = yaml.load(metadataContent) as PaintingMetadata;
  } catch (error) {
    console.error(`  ❌ Metadata not found: ${metadataPath}`);
    return;
  }

  // Validate metadata
  if (!metadata.title || !metadata.price) {
    console.error(`  ❌ Invalid metadata: title and price are required`);
    return;
  }

  // Check if painting already exists
  const existingDoc = await db.collection('paintings').doc(paintingId).get();
  if (existingDoc.exists) {
    console.log(`  ⚠️  Painting ${paintingId} already exists. Skipping...`);
    return;
  }

  // Upload full image
  const imageUrl = await uploadImage(
    imagePath,
    `paintings/${paintingId}${path.extname(imagePath)}`
  );
  console.log(`  ✅ Uploaded image`);

  // Generate and upload thumbnail
  const imageBuffer = await fs.readFile(imagePath);
  const thumbnailBuffer = await generateThumbnail(imageBuffer);
  const thumbnailPath = `/tmp/${paintingId}-thumb.jpg`;
  await fs.writeFile(thumbnailPath, thumbnailBuffer);
  
  const thumbnailUrl = await uploadImage(
    thumbnailPath,
    `paintings/thumbnails/${paintingId}.jpg`
  );
  console.log(`  ✅ Generated thumbnail`);

  // Create Firestore document
  const paintingDoc: PaintingDocument = {
    id: paintingId,
    ...metadata,
    imageUrl,
    thumbnailUrl,
    status: metadata.available ? 'available' : 'sold',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  };

  await db.collection('paintings').doc(paintingId).set(paintingDoc);
  console.log(`  ✅ Added to Firestore`);
  console.log(`  📦 ${metadata.title} - €${metadata.price}`);
}

async function main() {
  console.log('🎨 Bimbi - Paintings Upload Script\n');

  // Get all YAML files from metadata directory
  const metadataFiles = await fs.readdir(METADATA_DIR);
  const yamlFiles = metadataFiles.filter(f => 
    f.endsWith('.yaml') && !f.startsWith('_')
  );

  if (yamlFiles.length === 0) {
    console.log('⚠️  No painting metadata files found in paintings-data/metadata/');
    console.log('Create YAML files like: painting-001.yaml, painting-002.yaml');
    return;
  }

  console.log(`Found ${yamlFiles.length} painting(s) to process\n`);

  for (const yamlFile of yamlFiles) {
    const paintingId = path.basename(yamlFile, '.yaml');
    await processPainting(paintingId);
  }

  console.log('\n✨ Done!');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

