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

// Get storage bucket - try to find it or use default
// You can also set FIREBASE_STORAGE_BUCKET env variable to override
let storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (!storageBucket) {
  // Try firebasestorage.app format first (newer Firebase projects)
  storageBucket = `${serviceAccount.project_id}.firebasestorage.app`;
}

// Initialize app (we'll reinitialize if bucket is wrong)
let app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket,
});

const db = getFirestore(app);
let storage = getStorage(app).bucket();

// Verify bucket exists and try alternatives if needed
async function verifyBucket() {
  try {
    const [exists] = await storage.exists();
    if (exists) {
      console.log(`✅ Storage bucket verified: ${storageBucket}\n`);
      return;
    }
  } catch (error: any) {
    // Bucket doesn't exist or wrong format, try alternative
    if (error.message?.includes('not found') || error.message?.includes('404')) {
      console.log(`⚠️  Bucket "${storageBucket}" not found, trying alternative format...\n`);
      
      // Try appspot.com format (older Firebase projects)
      const altBucket = `${serviceAccount.project_id}.appspot.com`;
      console.log(`🔧 Trying: ${altBucket}\n`);
      
      try {
        const altStorage = getStorage(app).bucket(altBucket);
        const [altExists] = await altStorage.exists();
        
        if (altExists) {
          console.log(`✅ Found bucket: ${altBucket}\n`);
          storageBucket = altBucket;
          storage = altStorage;
          return;
        }
      } catch (altError) {
        // Both failed, show error
      }
    }
  }
  
  // If we get here, bucket doesn't exist
  console.error(`\n❌ ERROR: Storage bucket not found!\n`);
  console.error('📋 To find your correct bucket name:');
  console.error('   1. Go to Firebase Console → Storage');
  console.error('   2. Look at the URL or bucket name shown at the top');
  console.error('   3. Common formats:');
  console.error(`      - ${serviceAccount.project_id}.firebasestorage.app (newer projects)`);
  console.error(`      - ${serviceAccount.project_id}.appspot.com (older projects)`);
  console.error('   4. Set it as environment variable:');
  console.error(`      export FIREBASE_STORAGE_BUCKET="your-actual-bucket-name"`);
  console.error('   5. Then run: npm run upload\n');
  console.error('📋 If Storage is not enabled:');
  console.error('   1. Go to Firebase Console → Storage');
  console.error('   2. Click "Get started"');
  console.error('   3. Choose "Production mode"');
  console.error('   4. Select region (europe-west1 recommended)');
  console.error('   5. Click "Done"\n');
  process.exit(1);
}

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
const UPLOADED_IMAGES_DIR = './paintings-data/uploaded/images';
const UPLOADED_METADATA_DIR = './paintings-data/uploaded/metadata';
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
  let data: Partial<PaintingMetadata> = {};
  
  // Try to read YAML file, but don't fail if it doesn't exist
  try {
    const content = await fs.readFile(yamlPath, 'utf-8');
    data = yaml.load(content) as Partial<PaintingMetadata>;
  } catch (error) {
    // YAML file doesn't exist or is invalid - will use defaults
  }
  
  // Set defaults for missing fields
  const currentYear = new Date().getFullYear();
  
  return {
    title: data.title || 'Untitled',
    price: data.price || 100,
    currency: data.currency || 'EUR',
    width: data.width || 0, // Will be set from image if 0
    height: data.height || 0, // Will be set from image if 0
    medium: data.medium || 'Unknown',
    year: data.year || currentYear,
    description: data.description || 'No description available',
    tags: data.tags || [],
    available: data.available !== false, // Default to true
  };
}

async function uploadPainting(imageFileName: string): Promise<void> {
  const baseName = path.parse(imageFileName).name;
  const imagePath = path.join(IMAGES_DIR, imageFileName);
  const yamlPath = path.join(METADATA_DIR, `${baseName}.yaml`);
  
  console.log(`\n📷 Processing: ${baseName}`);
  
  // Check if YAML exists
  let hasYaml = true;
  try {
    await fs.access(yamlPath);
    console.log(`  → Reading metadata...`);
  } catch {
    console.log(`  ⚠️  No metadata file found, using defaults...`);
    hasYaml = false;
  }
  
  // Parse metadata (will use defaults if YAML doesn't exist)
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
  
  // Get image dimensions if not provided in metadata
  if (metadata.width === 0 || metadata.height === 0) {
    const imageMetadata = await sharp(imagePath).metadata();
    // Convert pixels to rough cm estimate (assume 72 DPI)
    const dpi = 72;
    const cmPerInch = 2.54;
    metadata.width = Math.round((imageMetadata.width || 0) / dpi * cmPerInch);
    metadata.height = Math.round((imageMetadata.height || 0) / dpi * cmPerInch);
    console.log(`  → Detected dimensions: ${metadata.width} × ${metadata.height} cm`);
  }
  
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
  
  // Move files to uploaded folder for backup
  console.log(`  → Moving files to uploaded folder...`);
  const uploadedImagePath = path.join(UPLOADED_IMAGES_DIR, imageFileName);
  await fs.rename(imagePath, uploadedImagePath);
  
  // Move YAML only if it exists
  if (hasYaml) {
    const uploadedYamlPath = path.join(UPLOADED_METADATA_DIR, `${baseName}.yaml`);
    await fs.rename(yamlPath, uploadedYamlPath);
  }
  
  console.log(`  📦 Backed up to uploaded folder`);
}

async function main() {
  console.log('🎨 Bimbi Paintings Uploader\n');
  
  // Verify storage bucket exists before proceeding
  await verifyBucket();
  
  // Ensure uploaded directories exist
  await fs.mkdir(UPLOADED_IMAGES_DIR, { recursive: true });
  await fs.mkdir(UPLOADED_METADATA_DIR, { recursive: true });
  
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
