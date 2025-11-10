// scripts/distribute-assets.js
import fs from 'fs-extra'; // You might need to npm install fs-extra if not present, or use standard fs
import path from 'path';
import sharp from 'sharp';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

// Dynamic imports for image analysis (with fallback)
let analyzeImageContent;
let convertPngToSvg;
let imageAnalysisAvailable = false;

// Setup paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Try to import image analysis utilities (fallback if not available)
(async () => {
    try {
        const imageAnalysis = await import('../src/utils/image-analysis.js');
        analyzeImageContent = imageAnalysis.analyzeImageContent;
        convertPngToSvg = imageAnalysis.convertPngToSvg;
        imageAnalysisAvailable = true;
        console.log('✅ Image analysis utilities loaded');
    } catch (error) {
        console.log('⚠️  Image analysis utilities not available, using fallback processing');
        imageAnalysisAvailable = false;
    }
})();

// Configuration
const CONFIG = {
    dropZone: path.join(PROJECT_ROOT, '_raw_assets'), // Create this folder!
    industriesDir: PROJECT_ROOT, // Root directory contains industry folders directly
    // Quality settings for automated optimization
    imageQuality: {
        jpeg: { quality: 80, mozjpeg: true },
        png: { compressionLevel: 9 },
        webp: { quality: 75, smartSubsample: true },
        avif: { quality: 75 }
    },
    // Command line options (will be set from CLI args)
    targetIndustry: null, // If set, only process images for this industry
    validIndustries: [] // Will be populated dynamically
};

async function distributeAssets() {
    console.log('🚀 Starting Asset Distribution Pipeline...');

    // Check if we're in rename mode
    if (CONFIG.renameIconsMode) {
        await renameIconsForProcessing();
        return;
    }

    // 1. Ensure drop zone exists
    if (!fs.existsSync(CONFIG.dropZone)) {
        fs.mkdirSync(CONFIG.dropZone);
        console.log(`✨ Created drop zone at: ${CONFIG.dropZone}`);
        console.log('👉 Place your named images (e.g., "legal-hero-1.jpg") in that folder and run this script again.');
        return;
    }

    // 2. Find all images in the drop zone and subfolders
    console.log(`🔍 Searching in: ${CONFIG.dropZone} (including subfolders)`);

    // Recursively find all image files in _raw_assets and subfolders
    const rawImages = await findImagesRecursively(CONFIG.dropZone);

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

        // If target industry is specified, only process images for that industry
        if (CONFIG.targetIndustry && industry !== CONFIG.targetIndustry) {
            console.log(`⏭️  Skipping ${filename}: Not in target industry (${CONFIG.targetIndustry})`);
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
        if (!['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext)) {
            console.warn(`⚠️  Skipping ${filename}: Invalid extension '${ext}'. Supported: jpg, jpeg, png, webp, svg`);
            continue;
        }

        // 4. Process the image with intelligent format selection
        const targetDir = path.join(CONFIG.industriesDir, industry, 'assets', 'images');

        // Verify industry exists
        if (fs.existsSync(path.join(CONFIG.industriesDir, industry))) {
            // Ensure target assets folder exists
            await fs.ensureDir(targetDir);

            // Check if all target files already exist (skip if already processed)
            const targetFilesExist = await checkIfTargetFilesExist(imgPath, industry, restOfName, targetDir);

            if (targetFilesExist.allExist) {
                console.log(`⏭️  Skipping ${filename}: All target files already exist in ${industry}/assets/images/`);
                continue;
            }

            // Process image (with or without analysis)
            if (imageAnalysisAvailable) {
                try {
                    // Analyze image content for intelligent processing
                    const analysis = await analyzeImageContent(imgPath);
                    console.log(`🔍 ${filename}: Detected as ${analysis.analysis.contentType} (${analysis.recommendations.reason})`);

                    // Get intelligent format selection
                    const formatsToUse = getIntelligentFormatsForDistribution(analysis);

                    // Process each recommended format
                    for (const format of formatsToUse) {
                        try {
                            const newFilename = `${industry}-${restOfName}.${format}`;
                            const targetPath = path.join(targetDir, newFilename);

                            // Skip if this specific format already exists
                            if (fs.existsSync(targetPath)) {
                                console.log(`  ⏭️  ${newFilename} already exists, skipping`);
                                continue;
                            }

                            console.log(`🔄 Processing: ${filename} -> ${industry}/.../${newFilename}`);

                            // Convert based on format and content type
                            await convertImageForDistribution(imgPath, targetPath, format, analysis);

                            successCount++;
                        } catch (formatError) {
                            console.warn(`⚠️  Failed to convert ${filename} to ${format}:`, formatError.message);
                            errorCount++;
                        }
                    }
                } catch (analysisError) {
                    console.warn(`⚠️  Analysis failed for ${filename}, using basic processing:`, analysisError.message);
                    await processImageBasic(imgPath, industry, restOfName, targetDir);
                    successCount++;
                }
            } else {
                // Basic processing without analysis
                console.log(`🔄 Processing (basic): ${filename} -> ${industry}/.../`);
                await processImageBasic(imgPath, industry, restOfName, targetDir);
                successCount++;
            }
        } else {
            console.warn(`⚠️  Skipping ${filename}: Industry "${industry}" not found.`);
        }
    }

    // Generate asset manifests for each industry
    await generateAssetManifests();

    console.log(`\\n✅ Finished! Successfully distributed: ${successCount} | Errors: ${errorCount}`);
}

/**
 * Get intelligent format selection for distribution based on image analysis
 */
function getIntelligentFormatsForDistribution(analysis) {
    const { recommendations } = analysis;

    // For distribution, we want multiple formats for better browser support
    // Icons: SVG primary, WebP/AVIF fallback
    // Photos: JPEG primary, WebP/AVIF for modern browsers
    if (analysis.analysis.isIcon) {
        return ['svg', 'webp', 'avif'];
    } else {
        return ['jpeg', 'webp', 'avif'];
    }
}

/**
 * Convert image for distribution with appropriate format handling
 */
async function convertImageForDistribution(inputPath, outputPath, format, analysis) {
    const ext = path.extname(outputPath).toLowerCase();

    switch (format) {
        case 'svg':
            // SVG conversion only for PNG icons
            if (analysis.metadata.format === 'png' && analysis.analysis.isIcon) {
                const success = await convertPngToSvg(inputPath, outputPath);
                if (!success) {
                    throw new Error('SVG conversion failed');
                }
            } else {
                throw new Error('SVG conversion only supported for PNG icons');
            }
            break;

        case 'jpeg':
            await sharp(inputPath)
                .jpeg(CONFIG.imageQuality.jpeg)
                .toFile(outputPath);
            break;

        case 'webp':
            await sharp(inputPath)
                .webp(CONFIG.imageQuality.webp)
                .toFile(outputPath);
            break;

        case 'avif':
            await sharp(inputPath)
                .avif(CONFIG.imageQuality.avif)
                .toFile(outputPath);
            break;

        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}

/**
 * Basic image processing when advanced analysis is not available
 */
async function processImageBasic(inputPath, industry, restOfName, targetDir) {
    const ext = path.extname(inputPath).toLowerCase().substring(1); // Get extension without dot

    // Handle SVG files differently - just copy them
    if (ext === 'svg') {
        const newFilename = `${industry}-${restOfName}.svg`;
        const targetPath = path.join(targetDir, newFilename);

        // Skip if SVG already exists
        if (fs.existsSync(targetPath)) {
            console.log(`  ⏭️  ${newFilename} already exists, skipping`);
            return;
        }

        console.log(`  → ${newFilename} (copied)`);
        await fs.copyFile(inputPath, targetPath);
        return;
    }

    // Create multiple formats for raster images
    const formats = ['webp', 'jpeg']; // Basic fallback formats

    for (const format of formats) {
        try {
            const newFilename = `${industry}-${restOfName}.${format}`;
            const targetPath = path.join(targetDir, newFilename);

            // Skip if this format already exists
            if (fs.existsSync(targetPath)) {
                console.log(`  ⏭️  ${newFilename} already exists, skipping`);
                continue;
            }

            console.log(`  → ${newFilename}`);

            switch (format) {
                case 'webp':
                    await sharp(inputPath)
                        .webp(CONFIG.imageQuality.webp)
                        .toFile(targetPath);
                    break;
                case 'jpeg':
                    await sharp(inputPath)
                        .jpeg(CONFIG.imageQuality.jpeg)
                        .toFile(targetPath);
                    break;
            }
        } catch (error) {
            console.warn(`  ⚠️  Failed to create ${format} version:`, error.message);
        }
    }
}

/**
 * Rename icons in subfolders to follow proper naming convention
 */
async function renameIconsForProcessing() {
    console.log('🔧 Starting Icon Renaming Process...');

    const iconsDir = path.join(CONFIG.dropZone, 'icons');
    if (!fs.existsSync(iconsDir)) {
        console.log('❌ Icons directory not found:', iconsDir);
        return;
    }

    // Mapping from folder names to industry names
    const folderToIndustryMap = {
        'Fitness': 'fitness',
        'Medical': 'healthcare',
        'contractor-icon-hvac': 'contractors-trades',
        'e-commerce': 'retail-ecommerce',
        'photography': 'photography',
        'restaurant': 'restaurants',
        'roofing': 'roofing'
    };

    let renamedCount = 0;
    let skippedCount = 0;

    // Process each subfolder in icons directory
    const iconFolders = await fs.readdir(iconsDir);

    for (const folderName of iconFolders) {
        const folderPath = path.join(iconsDir, folderName);
        const stat = await fs.stat(folderPath);

        if (!stat.isDirectory()) continue;

        const industryName = folderToIndustryMap[folderName];
        if (!industryName) {
            console.log(`⚠️  Skipping unknown folder: ${folderName}`);
            continue;
        }

        console.log(`📁 Processing ${folderName} → ${industryName}`);

        // Get all files in this folder (recursively)
        const files = await findImagesRecursively(folderPath);

        for (const filePath of files) {
            const fileName = path.basename(filePath);
            const relativePath = path.relative(folderPath, filePath);
            const ext = path.extname(fileName).toLowerCase();

            // Skip if already follows naming convention
            if (fileName.startsWith(industryName + '-')) {
                console.log(`⏭️  Already renamed: ${relativePath}`);
                skippedCount++;
                continue;
            }

            // Create new filename
            const baseName = path.basename(fileName, ext);
            let newFileName;

            // Special handling for different file types
            if (fileName.includes('icon') || fileName.includes('badge') || fileName.includes('logo')) {
                newFileName = `${industryName}-icon-${baseName}${ext}`;
            } else {
                // Generic icon naming
                newFileName = `${industryName}-icon-${baseName}${ext}`;
            }

            const newFilePath = path.join(path.dirname(filePath), newFileName);

            try {
                // Rename the file
                await fs.rename(filePath, newFilePath);
                console.log(`✅ Renamed: ${relativePath} → ${newFileName}`);
                renamedCount++;
            } catch (error) {
                console.error(`❌ Failed to rename ${filePath}:`, error.message);
            }
        }
    }

    console.log(`\n🎉 Icon renaming complete!`);
    console.log(`📊 Renamed: ${renamedCount} files`);
    console.log(`⏭️  Skipped: ${skippedCount} files (already renamed)`);
    console.log(`💡 Now run: npm run distribute-assets`);
}

/**
 * Check if a folder is a valid industry folder
 */
async function isValidIndustryFolder(folderPath) {
    try {
        const items = await fs.readdir(folderPath);

        // Check for template subfolders (minimal-creative, business-professional, professional-enterprise)
        const templateFolders = ['minimal-creative', 'business-professional', 'professional-enterprise'];
        const hasTemplateFolders = items.some(item => {
            const itemPath = path.join(folderPath, item);
            const stat = fs.statSync(itemPath);
            return stat.isDirectory() && templateFolders.includes(item);
        });

        if (hasTemplateFolders) {
            return true;
        }

        // Check for HTML files recursively (more thorough check)
        const htmlFiles = await findFilesRecursively(folderPath, ['.html']);
        if (htmlFiles.length > 0) {
            return true;
        }

        // Check for assets folder
        if (items.includes('assets')) {
            const assetsPath = path.join(folderPath, 'assets');
            const assetsStat = fs.statSync(assetsPath);
            if (assetsStat.isDirectory()) {
                return true;
            }
        }

        return false;
    } catch (error) {
        return false;
    }
}

/**
 * Check if all target files for an image already exist in the destination directory
 */
async function checkIfTargetFilesExist(inputPath, industry, restOfName, targetDir) {
    try {
        const ext = path.extname(inputPath).toLowerCase().substring(1); // Get extension without dot

        // For SVG files, just check if the SVG version exists
        if (ext === 'svg') {
            const expectedFilename = `${industry}-${restOfName}.svg`;
            const expectedPath = path.join(targetDir, expectedFilename);

            return {
                allExist: fs.existsSync(expectedPath),
                existingFiles: fs.existsSync(expectedPath) ? [expectedFilename] : [],
                missingFiles: fs.existsSync(expectedPath) ? [] : [expectedFilename],
                expectedFormats: ['svg']
            };
        }

        // Determine what formats would be generated for this image
        let expectedFormats = [];

        if (imageAnalysisAvailable) {
            try {
                // Use analysis to determine formats
                const analysis = await analyzeImageContent(inputPath);
                expectedFormats = getIntelligentFormatsForDistribution(analysis);
            } catch (analysisError) {
                // Fall back to basic formats if analysis fails
                expectedFormats = ['webp', 'jpeg'];
            }
        } else {
            // Basic fallback formats
            expectedFormats = ['webp', 'jpeg'];
        }

        // Check if all expected format files exist
        const existingFiles = [];
        const missingFiles = [];

        for (const format of expectedFormats) {
            const expectedFilename = `${industry}-${restOfName}.${format}`;
            const expectedPath = path.join(targetDir, expectedFilename);

            if (fs.existsSync(expectedPath)) {
                existingFiles.push(expectedFilename);
            } else {
                missingFiles.push(expectedFilename);
            }
        }

        return {
            allExist: missingFiles.length === 0,
            existingFiles,
            missingFiles,
            expectedFormats
        };

    } catch (error) {
        // If checking fails, assume files don't exist to be safe
        return {
            allExist: false,
            existingFiles: [],
            missingFiles: [],
            expectedFormats: []
        };
    }
}

/**
 * Find files with specific extensions recursively
 */
async function findFilesRecursively(dirPath, extensions) {
    const results = [];

    async function scanDirectory(currentPath) {
        try {
            const items = await fs.readdir(currentPath);

            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = await fs.stat(fullPath);

                if (stat.isDirectory()) {
                    // Recursively scan subdirectories (but avoid going too deep)
                    const relativeDepth = path.relative(dirPath, fullPath).split(path.sep).length;
                    if (relativeDepth < 3) { // Limit depth to avoid performance issues
                        await scanDirectory(fullPath);
                    }
                } else if (stat.isFile()) {
                    // Check if file has one of the target extensions
                    const ext = path.extname(item).toLowerCase();
                    if (extensions.includes(ext)) {
                        results.push(fullPath);
                    }
                }
            }
        } catch (error) {
            // Ignore errors for individual directories
        }
    }

    await scanDirectory(dirPath);
    return results;
}

/**
 * Dynamically detect all industry folders in the project
 */
async function detectIndustries() {
    console.log('🔍 Detecting industry folders...');

    try {
        const items = await fs.readdir(CONFIG.industriesDir);
        const industries = [];

        for (const item of items) {
            const fullPath = path.join(CONFIG.industriesDir, item);
            const stat = await fs.stat(fullPath);

            // Check if it's a directory and not a system/special folder
            if (stat.isDirectory() &&
                !item.startsWith('.') &&
                !['node_modules', 'dist', 'build', 'scripts', 'src', 'public', '_raw_assets'].includes(item)) {

                // Check if this looks like an industry folder by examining its contents
                const isIndustryFolder = await isValidIndustryFolder(fullPath);

                if (isIndustryFolder) {
                    industries.push(item);
                    console.log(`✅ Found industry: ${item}`);
                }
            }
        }

        CONFIG.validIndustries = industries.sort();
        console.log(`📊 Detected ${industries.length} industries: ${industries.join(', ')}`);

    } catch (error) {
        console.error('❌ Failed to detect industries:', error.message);
        // Fallback to hardcoded list if detection fails
        CONFIG.validIndustries = [
            'contractors-trades',
            'real-estate',
            'retail-ecommerce',
            'fitness',
            'healthcare',
            'legal',
            'photography',
            'restaurants',
            'roofing'
        ];
        console.log('⚠️  Using fallback industry list');
    }
}

/**
 * Generate asset manifests for all industries
 */
async function generateAssetManifests() {
    console.log('\n📋 Generating Asset Manifests...');

    const startTime = Date.now();
    let totalImages = 0;
    let totalSize = 0;

    for (const industry of CONFIG.validIndustries) {
        const assetsDir = path.join(CONFIG.industriesDir, industry, 'assets');
        const imagesDir = path.join(assetsDir, 'images');

        // Skip if no assets directory exists
        if (!fs.existsSync(imagesDir)) {
            continue;
        }

        console.log(`📄 Generating manifest for ${industry}...`);

        // Find all optimized images in this industry's assets
        const imageFiles = await findImagesRecursively(imagesDir);
        const manifestData = {
            version: "1.0.0",
            industry: industry,
            generated: new Date().toISOString(),
            images: {},
            stats: {
                totalImages: 0,
                totalSize: 0,
                formats: {}
            }
        };

        // Process each image file
        for (const imagePath of imageFiles) {
            const filename = path.basename(imagePath);
            const ext = path.extname(filename).toLowerCase().substring(1); // Remove the dot
            const baseName = path.basename(filename, path.extname(filename));

            // Get file stats
            const stats = await fs.stat(imagePath);
            const fileSize = stats.size;

            // Get image dimensions using sharp
            let dimensions = null;
            try {
                if (['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(filename).toLowerCase())) {
                    const metadata = await sharp(imagePath).metadata();
                    dimensions = {
                        width: metadata.width,
                        height: metadata.height
                    };
                }
            } catch (error) {
                // Skip dimension detection for unsupported formats
            }

            // Initialize image entry if it doesn't exist
            if (!manifestData.images[baseName]) {
                manifestData.images[baseName] = {
                    original: `${baseName}.jpg`, // Assume original was JPG
                    formats: [],
                    sizes: {},
                    dimensions: dimensions
                };
            }

            // Add format and size info
            manifestData.images[baseName].formats.push(ext);
            manifestData.images[baseName].sizes[ext] = fileSize;

            // Update format stats
            if (!manifestData.stats.formats[ext]) {
                manifestData.stats.formats[ext] = { count: 0, totalSize: 0 };
            }
            manifestData.stats.formats[ext].count++;
            manifestData.stats.formats[ext].totalSize += fileSize;

            totalImages++;
            totalSize += fileSize;
            manifestData.stats.totalImages++;
            manifestData.stats.totalSize += fileSize;
        }

        // Sort formats array for consistency
        Object.values(manifestData.images).forEach(image => {
            image.formats.sort();
        });

        // Write manifest file
        const manifestPath = path.join(assetsDir, 'manifest.json');
        await fs.writeFile(manifestPath, JSON.stringify(manifestData, null, 2));

        console.log(`✅ Created ${industry}/assets/manifest.json (${Object.keys(manifestData.images).length} images)`);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`📊 Manifest Generation Complete:`);
    console.log(`   ⏱️  Duration: ${duration}s`);
    console.log(`   🖼️  Total Images: ${totalImages}`);
    console.log(`   💾 Total Size: ${formatBytes(totalSize)}`);
}

/**
 * Format bytes for human-readable display
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Recursively find all image files in a directory and its subdirectories
 */
async function findImagesRecursively(dirPath) {
    const results = [];

    async function scanDirectory(currentPath) {
        const items = await fs.readdir(currentPath);

        for (const item of items) {
            const fullPath = path.join(currentPath, item);
            const stat = await fs.stat(fullPath);

            if (stat.isDirectory()) {
                // Recursively scan subdirectories
                await scanDirectory(fullPath);
            } else if (stat.isFile()) {
                // Check if it's an image file
                const ext = path.extname(item).toLowerCase();
                if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif'].includes(ext)) {
                    results.push(fullPath);
                }
            }
        }
    }

    await scanDirectory(dirPath);
    return results;
}

// CLI argument parsing
function parseArguments() {
    const args = process.argv.slice(2);

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--industry':
            case '-i':
                const industry = args[++i];
                if (CONFIG.validIndustries.includes(industry)) {
                    CONFIG.targetIndustry = industry;
                    console.log(`🎯 Targeting industry: ${industry}`);
                } else {
                    console.error(`❌ Invalid industry: ${industry}`);
                    console.error(`Valid industries: ${CONFIG.validIndustries.join(', ')}`);
                    process.exit(1);
                }
                break;
            case '--rename-icons':
            case '--fix-icons':
                CONFIG.renameIconsMode = true;
                console.log('🔧 Icon renaming mode enabled - will rename icons to follow naming convention');
                break;
            case '--help':
            case '-h':
                console.log(`
Asset Distribution Script

Usage: npm run distribute-assets [options]

Options:
  -i, --industry <name>    Process only images for specific industry
  --rename-icons           Rename icons in subfolders to follow naming convention
  -h, --help              Show this help

Valid Industries:
  ${CONFIG.validIndustries.join('\n  ')}

Examples:
  npm run distribute-assets                    # Process all industries
  npm run distribute-assets --industry roofing # Process only roofing images
  npm run distribute-assets --rename-icons     # Rename icons to proper format
  npm run distribute-assets -i fitness         # Process only fitness images
`);
                process.exit(0);
                break;
            default:
                console.error(`Unknown option: ${args[i]}`);
                console.log('Use --help for usage information');
                process.exit(1);
        }
    }
}

async function main() {
    // First detect industries, then parse arguments
    await detectIndustries();
    parseArguments();
    await distributeAssets();
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
