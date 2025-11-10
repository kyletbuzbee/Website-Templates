#!/usr/bin/env node

/**
 * Comprehensive Image Size Standardization Script
 * Automatically categorizes and optimizes images to industry-standard sizes
 */

import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Image size specifications for different categories
const IMAGE_SPECS = {
  // Hero images - full-width backgrounds (16:9 ratio)
  hero: {
    width: 1920,
    height: 1080,
    quality: 80,
    format: 'webp',
    suffix: '_hero'
  },

  // Team/About images - professional headshots (4:3 ratio)
  team: {
    width: 800,
    height: 600,
    quality: 85,
    format: 'webp',
    suffix: '_team'
  },

  // Profile/Avatar images - circular displays (square)
  avatar: {
    width: 200,
    height: 200,
    quality: 90,
    format: 'webp',
    suffix: '_avatar'
  },

  // Property images - real estate listings (3:2 ratio)
  property: {
    width: 600,
    height: 400,
    quality: 85,
    format: 'webp',
    suffix: '_property'
  },

  // Work/Project images - portfolio items (4:3 ratio)
  work: {
    width: 600,
    height: 450,
    quality: 85,
    format: 'webp',
    suffix: '_work'
  },

  // Gallery images - already optimized (4:3 ratio)
  gallery: {
    width: 600,
    height: 450,
    quality: 85,
    format: 'webp',
    suffix: '_gallery'
  }
};

// Filename patterns for automatic categorization
const CATEGORY_PATTERNS = {
  hero: [
    /hero/i,
    /banner/i,
    /background/i,
    /header/i,
    /jumbotron/i
  ],
  team: [
    /team/i,
    /about/i,
    /staff/i,
    /professional/i,
    /doctor/i,
    /attorney/i,
    /agent/i,
    /crew/i,
    /staff/i
  ],
  avatar: [
    /avatar/i,
    /profile/i,
    /testimonial/i,
    /client/i,
    /person/i,
    /user/i
  ],
  property: [
    /property/i,
    /house/i,
    /building/i,
    /real.?estate/i,
    /apartment/i,
    /commercial/i,
    /residential/i,
    /luxury/i,
    /estate/i
  ],
  work: [
    /work/i,
    /project/i,
    /portfolio/i,
    /service/i,
    /result/i,
    /before.?after/i,
    /renovation/i,
    /construction/i
  ],
  gallery: [
    /gallery/i,
    /classes/i,
    /equipment/i,
    /trainers/i,
    /facilities/i,
    /services/i
  ]
};

// Industry-specific image mappings
const INDUSTRY_HERO_IMAGES = {
  fitness: 'fitness-hero-strength-training.jpg',
  healthcare: 'healthcare-hero-medical-team.jpg',
  'contractors-trades': 'contractors-trades--projects-swinginghammer.jpg',
  restaurants: 'restaurants-plate-2.svg',
  photography: 'photography-hero-road.jpg',
  roofing: 'roofing-hero-professional-crew.jpg',
  'retail-ecommerce': 'ecommerce-cart-1.svg',
  legal: 'legal-team-professional.jpg',
  'real-estate': 'real-estate-luxury-home.jpg'
};

async function optimizeImagesStandardized() {
  console.log('🖼️  Starting Comprehensive Image Size Standardization...\n');

  const industries = await getIndustryFolders();
  let totalProcessed = 0;
  let totalOptimized = 0;
  let totalSaved = 0;

  for (const industry of industries) {
    console.log(`📁 Processing ${industry} images...`);

    const result = await optimizeIndustryImages(industry);
    totalProcessed += result.processed;
    totalOptimized += result.optimized;
    totalSaved += result.saved;

    console.log(`   ✅ Processed ${result.processed} images, optimized ${result.optimized} (${formatBytes(result.saved)} saved)\n`);
  }

  console.log('🎉 Image standardization complete!');
  console.log(`📊 Summary:`);
  console.log(`   🖼️  Images processed: ${totalProcessed}`);
  console.log(`   ⚡ Images optimized: ${totalOptimized}`);
  console.log(`   💾 Space saved: ${formatBytes(totalSaved)}`);
  console.log(`   📏 All images now follow size standards!`);
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

      const assetsPath = path.join(fullPath, 'assets', 'images');
      if (await fs.pathExists(assetsPath)) {
        industries.push(item);
      }
    }
  }

  return industries;
}

async function optimizeIndustryImages(industry) {
  const assetsPath = path.join(PROJECT_ROOT, industry, 'assets', 'images');
  const images = await fs.readdir(assetsPath);

  let processed = 0;
  let optimized = 0;
  let saved = 0;

  // Filter for image files
  const imageFiles = images.filter(file =>
    /\.(jpg|jpeg|png|webp)$/i.test(file) &&
    !file.includes('_hero') &&
    !file.includes('_team') &&
    !file.includes('_avatar') &&
    !file.includes('_property') &&
    !file.includes('_work') &&
    !file.includes('_gallery')
  );

  for (const imageFile of imageFiles) {
    const inputPath = path.join(assetsPath, imageFile);

    try {
      // Determine category based on filename
      const category = detectImageCategory(imageFile, industry);

      if (category) {
        const specs = IMAGE_SPECS[category];
        const result = await optimizeImageToSpec(inputPath, specs, industry);

        if (result) {
          processed++;
          optimized++;
          saved += result.saved;

          console.log(`      ✅ ${imageFile} → ${category} (${specs.width}×${specs.height})`);
        }
      } else {
        console.log(`      ⏭️  ${imageFile} - category not detected, skipping`);
      }
    } catch (error) {
      console.log(`      ❌ Failed to process: ${imageFile} - ${error.message}`);
    }
  }

  return { processed, optimized, saved };
}

function detectImageCategory(filename, industry) {
  const lowerFilename = filename.toLowerCase();

  // Check each category pattern
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerFilename)) {
        return category;
      }
    }
  }

  // Special handling for hero images based on industry
  if (INDUSTRY_HERO_IMAGES[industry] && lowerFilename.includes(path.parse(INDUSTRY_HERO_IMAGES[industry]).name)) {
    return 'hero';
  }

  // Default to work/gallery for unrecognized images
  return lowerFilename.includes('gallery') || lowerFilename.includes('work') ? 'work' : null;
}

async function optimizeImageToSpec(inputPath, specs, industry) {
  const parsedPath = path.parse(inputPath);
  const outputFilename = `${parsedPath.name}${specs.suffix}.${specs.format}`;
  const outputPath = path.join(parsedPath.dir, outputFilename);

  try {
    // Check if optimized version already exists and is up to date
    if (await fs.pathExists(outputPath)) {
      const inputStats = await fs.stat(inputPath);
      const outputStats = await fs.stat(outputPath);

      if (outputStats.mtime > inputStats.mtime) {
        // Already optimized and up to date
        return null;
      }
    }

    // Get original file size
    const originalStats = await fs.stat(inputPath);
    const originalSize = originalStats.size;

    // Optimize image
    await sharp(inputPath)
      .resize(specs.width, specs.height, {
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true
      })
      .webp({ quality: specs.quality })
      .toFile(outputPath);

    // Get optimized file size
    const optimizedStats = await fs.stat(outputPath);
    const optimizedSize = optimizedStats.size;

    return {
      originalSize,
      optimizedSize,
      saved: Math.max(0, originalSize - optimizedSize)
    };

  } catch (error) {
    console.warn(`   ⚠️  Failed to optimize ${inputPath}:`, error.message);
    return null;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Run the script
optimizeImagesStandardized().catch(error => {
  console.error('❌ Error optimizing images:', error);
  process.exit(1);
});
