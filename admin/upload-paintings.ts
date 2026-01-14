import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
import sharp from 'sharp';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(
  await fs.readFile('./service-account.json', 'utf-8')
) as ServiceAccount;

// Get storage bucket from service account
const storageBucket = `${serviceAccount.project_id}.appspot.com`;

initializeApp({
  credential: cert(serviceAccount),
  storageBucket,
});

const db = getFirestore();
const storage = getStorage().bucket();

// Painting metadata interface
interface PaintingMetadata {
  title: string;
  price: number;
  currency?: string;
  width: number;
  height: number;
  medium: string;
  year: number;
  description: string;
  tags?: string[];
  available?: boolean;
}

interface PaintingDocument extends PaintingMetadata {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const IMAGES_DIR = './paintings-data/images';
const METADATA_DIR = './paintings-data/metadata';
const THUMBNAIL_WIDTH = 400;

async function generateThumbnail(imagePath: string): Promise<Buffer> {
  console.log(`  → Generating thumbnail...`);
  return await sharp(imagePath)
    .resize(THUMBNAIL_WIDTH, null, { withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
}

async function uploadToStorage(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const file = storage.file(fileName);
  await file.save(buffer, {
    contentType,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });
  
  // Make file publicly accessible
  await file.makePublic();
  
  return `https://storage.googleapis.com/${storage.name}/${fileName}`;
}

async function processYamlFile(yamlPath: string): Promise<PaintingMetadata> {
  const content = await fs.readFile(yamlPath, 'utf-8');
  const data = yaml.load(content) as PaintingMetadata;
  
  // Validate required fields
  const required = ['title', 'price', 'width', 'height', 'medium', 'year', 'description'];
  for (const field of required) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field} in ${yamlPath}`);
    }
  }
  
  // Set defaults
  data.currency = data.currency || 'EUR';
  data.available = data.available !== false; // Default to true
  
  return data;
}

async function uploadPainting(imageFileName: string): Promise<void> {
  const baseName = path.parse(imageFileName).name;
  const imagePath = path.join(IMAGES_DIR, imageFileName);
  const yamlPath = path.join(METADATA_DIR, `${baseName}.yaml`);
  
  console.log(`\n📷 Processing: ${baseName}`);
  
  // Check if YAML exists
  try {
    await fs.access(yamlPath);
  } catch {
    console.log(`  ⚠️  No metadata file found (${baseName}.yaml), skipping...`);
    return;
  }
  
  // Parse metadata
  console.log(`  → Reading metadata...`);
  const metadata = await processYamlFile(yamlPath);
  
  // Check if already exists in Firestore
  const existingDoc = await db.collection('paintings').doc(baseName).get();
  if (existingDoc.exists) {
    console.log(`  ℹ️  Already exists in database, skipping upload...`);
    console.log(`     Use --force to overwrite existing paintings`);
    return;
  }
  
  // Read image file
  console.log(`  → Reading image file...`);
  const imageBuffer = await fs.readFile(imagePath);
  
  // Generate thumbnail
  const thumbnailBuffer = await generateThumbnail(imagePath);
  
  // Upload full image
  console.log(`  → Uploading full image...`);
  const imageUrl = await uploadToStorage(
    imageBuffer,
    `paintings/${baseName}${path.extname(imageFileName)}`,
    'image/jpeg'
  );
  
  // Upload thumbnail
  console.log(`  → Uploading thumbnail...`);
  const thumbnailUrl = await uploadToStorage(
    thumbnailBuffer,
    `paintings/thumbs/${baseName}_thumb.jpg`,
    'image/jpeg'
  );
  
  // Save to Firestore
  console.log(`  → Saving to Firestore...`);
  const paintingDoc: PaintingDocument = {
    id: baseName,
    ...metadata,
    imageUrl,
    thumbnailUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await db.collection('paintings').doc(baseName).set(paintingDoc);
  
  console.log(`  ✅ Successfully uploaded: ${metadata.title}`);
}

async function main() {
  console.log('🎨 Bimbi Paintings Uploader\n');
  
  // Get all image files
  const files = await fs.readdir(IMAGES_DIR);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file) && !file.startsWith('.')
  );
  
  if (imageFiles.length === 0) {
    console.log('❌ No image files found in paintings-data/images/');
    process.exit(1);
  }
  
  console.log(`Found ${imageFiles.length} image(s) to process\n`);
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const imageFile of imageFiles) {
    try {
      await uploadPainting(imageFile);
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`  ❌ Error processing ${imageFile}:`, error);
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Uploaded: ${successCount}`);
  console.log(`⏭️  Skipped: ${skipCount}`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount}`);
  }
  console.log(`${'='.repeat(50)}\n`);
}

main().catch(console.error);
