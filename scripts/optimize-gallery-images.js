#!/usr/bin/env node

/**
 * Optimize Gallery Images
 * Ensures all gallery images are consistently sized and optimized
 */

import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Gallery image specifications
const GALLERY_SPECS = {
  width: 600,        // Standard width for gallery images
  height: 450,       // 4:3 aspect ratio (600 * 0.75)
  quality: 85,       // Good quality with reasonable file size
  format: 'webp'     // Modern format with good compression
};

async function optimizeGalleryImages() {
  console.log('🖼️  Optimizing Gallery Images for Consistent Display...\n');

  const industries = await getIndustryFolders();
  let totalProcessed = 0;
  let totalOptimized = 0;

  for (const industry of industries) {
    console.log(`📁 Processing ${industry} gallery images...`);

    const processed = await optimizeIndustryGalleryImages(industry);
    totalProcessed += processed.processed;
    totalOptimized += processed.optimized;

    console.log(`   ✅ Processed ${processed.processed} images, optimized ${processed.optimized}\n`);
  }

  console.log('🎉 Gallery image optimization complete!');
  console.log(`📊 Summary:`);
  console.log(`   🖼️  Images processed: ${totalProcessed}`);
  console.log(`   ⚡ Images optimized: ${totalOptimized}`);
  console.log(`   📏 Standard size: ${GALLERY_SPECS.width}x${GALLERY_SPECS.height}px`);
  console.log(`   🎯 All gallery images now consistently sized!`);
}

async function getIndustryFolders() {
  const items = await fs.readdir(PROJECT_ROOT);
  const industries = [];

  for (const item of items) {
    const fullPath = path.join(PROJECT_ROOT, item);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory() &&
        !item.startsWith('.') &&
        !['_raw_assets', 'node_modules', 'dist', 'build', 'scripts', 'src', 'public'].includes(item)) {

      // Check if it has assets/images folder
      const assetsPath = path.join(fullPath, 'assets', 'images');
      if (await fs.pathExists(assetsPath)) {
        industries.push(item);
      }
    }
  }

  return industries;
}

async function optimizeIndustryGalleryImages(industry) {
  const assetsPath = path.join(PROJECT_ROOT, industry, 'assets', 'images');
  const images = await fs.readdir(assetsPath);

  let processed = 0;
  let optimized = 0;

  // Filter for image files that are likely used in galleries
  const imageFiles = images.filter(file =>
    /\.(jpg|jpeg|png|webp)$/i.test(file) &&
    (file.includes('gallery') || file.includes('classes') || file.includes('equipment') ||
     file.includes('trainers') || file.includes('hero') || file.includes('work'))
  );

  for (const imageFile of imageFiles) {
    const inputPath = path.join(assetsPath, imageFile);
    const outputPath = path.join(assetsPath, getOptimizedFilename(imageFile));

    try {
      // Check if image needs optimization
      const stats = await fs.stat(inputPath);
      const needsOptimization = await shouldOptimizeImage(inputPath, outputPath);

      if (needsOptimization) {
        await optimizeImage(inputPath, outputPath);
        console.log(`      ⚡ Optimized: ${imageFile}`);
        optimized++;
      } else {
        console.log(`      ✅ Already optimized: ${imageFile}`);
      }

      processed++;
    } catch (error) {
      console.log(`      ❌ Failed to process: ${imageFile} - ${error.message}`);
    }
  }

  return { processed, optimized };
}

function getOptimizedFilename(originalFilename) {
  const ext = path.extname(originalFilename);
  const name = path.basename(originalFilename, ext);
  return `${name}_gallery.${GALLERY_SPECS.format}`;
}

async function shouldOptimizeImage(inputPath, outputPath) {
  // Check if optimized version exists
  if (!await fs.pathExists(outputPath)) {
    return true;
  }

  // Check if original is newer than optimized
  const inputStats = await fs.stat(inputPath);
  const outputStats = await fs.stat(outputPath);

  if (inputStats.mtime > outputStats.mtime) {
    return true;
  }

  // Check dimensions of existing optimized image
  try {
    const metadata = await sharp(outputPath).metadata();
    return metadata.width !== GALLERY_SPECS.width || metadata.height !== GALLERY_SPECS.height;
  } catch {
    return true;
  }
}

async function optimizeImage(inputPath, outputPath) {
  await sharp(inputPath)
    .resize(GALLERY_SPECS.width, GALLERY_SPECS.height, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: GALLERY_SPECS.quality })
    .toFile(outputPath);
}

// Run the script
optimizeGalleryImages().catch(error => {
  console.error('❌ Error optimizing gallery images:', error);
  process.exit(1);
});
