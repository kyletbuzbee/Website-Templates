// scripts/distribute-assets.js
import fs from 'fs-extra'; // You might need to npm install fs-extra if not present, or use standard fs
import path from 'path';
import sharp from 'sharp';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

// Setup paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
    dropZone: path.join(PROJECT_ROOT, '_raw_assets'), // Create this folder!
    industriesDir: PROJECT_ROOT, // Root directory contains industry folders directly
    // Valid industry names (including hyphenated ones)
    validIndustries: [
        'contractors-trades',
        'real-estate',
        'retail-ecommerce',
        'fitness',
        'healthcare',
        'legal',
        'photography',
        'restaurants',
        'roofing'
    ],
    // Quality settings for automated optimization
    imageQuality: {
        jpeg: { quality: 80, mozjpeg: true },
        png: { compressionLevel: 9 },
        webp: { quality: 75, smartSubsample: true }
    }
};

async function distributeAssets() {
    console.log('🚀 Starting Asset Distribution Pipeline...');

    // 1. Ensure drop zone exists
    if (!fs.existsSync(CONFIG.dropZone)) {
        fs.mkdirSync(CONFIG.dropZone);
        console.log(`✨ Created drop zone at: ${CONFIG.dropZone}`);
        console.log('👉 Place your named images (e.g., "legal-hero-1.jpg") in that folder and run this script again.');
        return;
    }

    // 2. Find all images in the drop zone
    console.log(`🔍 Searching in: ${CONFIG.dropZone}`);

    // Use fs.readdirSync for reliability
    const allFiles = fs.readdirSync(CONFIG.dropZone);

    const rawImages = allFiles
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
        })
        .map(file => path.join(CONFIG.dropZone, file));

    if (rawImages.length === 0) {
        console.log('⚠️  No images found in _raw_assets. Nothing to do.');
        console.log('💡 Try: dir _raw_assets to see what files are there');
        return;
    }

    console.log(`📦 Found ${rawImages.length} images to process.`);

    let successCount = 0;
    let errorCount = 0;

    for (const imgPath of rawImages) {
        const filename = path.basename(imgPath);

        // 3. Parse filename: industry-section-desc.ext
        // Find the longest matching industry name from our valid list
        let industry = null;
        let restOfFilename = filename;

        for (const validIndustry of CONFIG.validIndustries) {
            if (filename.startsWith(validIndustry + '-')) {
                industry = validIndustry;
                restOfFilename = filename.substring(validIndustry.length + 1); // +1 for the hyphen
                break;
            }
        }

        if (!industry) {
            console.warn(`⚠️  Skipping ${filename}: Industry not recognized. Valid industries: ${CONFIG.validIndustries.join(', ')}`);
            continue;
        }

        // Extract extension from remaining filename
        const lastDotIndex = restOfFilename.lastIndexOf('.');
        if (lastDotIndex === -1) {
            console.warn(`⚠️  Skipping ${filename}: No file extension found`);
            continue;
        }

        const restOfName = restOfFilename.substring(0, lastDotIndex);
        const ext = restOfFilename.substring(lastDotIndex + 1).toLowerCase();

        // Validate extension
        if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
            console.warn(`⚠️  Skipping ${filename}: Invalid extension '${ext}'. Supported: jpg, jpeg, png, webp`);
            continue;
        }

        // 4. Process the image
        const targetDir = path.join(CONFIG.industriesDir, industry, 'assets', 'images');

        // Verify industry exists
        if (fs.existsSync(path.join(CONFIG.industriesDir, industry))) {
            // Ensure target assets folder exists
            await fs.ensureDir(targetDir);

            // Define new paths
            // We auto-convert everything to WebP for performance if it isn't already
            const newFilename = `${industry}-${restOfName}.webp`;
            const targetPath = path.join(targetDir, newFilename);

            try {
                console.log(`🔄 Processing: ${filename} -> ${industry}/.../${newFilename}`);

                // 5. Optimize and Move (using sharp)
                await sharp(imgPath)
                    .webp(CONFIG.imageQuality.webp)
                    .toFile(targetPath);

                // Optional: Delete original after successful processing
                // await fs.remove(imgPath);

                successCount++;
            } catch (err) {
                console.error(`❌ Failed to process ${filename}:`, err.message);
                errorCount++;
            }
        } else {
            console.warn(`⚠️  Skipping ${filename}: Industry "${industry}" not found.`);
        }
    }

    console.log(`\\n✅ Finished! Successfully distributed: ${successCount} | Errors: ${errorCount}`);
}

distributeAssets();
