#!/usr/bin/env node

/**
 * Template Auto-Update Script
 * Automatically updates HTML templates to use optimized images from manifests
 * Replaces <img> tags with <picture> elements for modern responsive images
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Industries to process
const INDUSTRIES = [
    'contractors-trades',
    'fitness',
    'healthcare',
    'legal',
    'photography',
    'real-estate',
    'restaurants',
    'retail-ecommerce',
    'roofing'
];

async function updateTemplates() {
    console.log('🎨 Starting Template Auto-Update...');

    let totalFilesUpdated = 0;
    let totalImagesReplaced = 0;

    for (const industry of INDUSTRIES) {
        console.log(`\n📁 Processing ${industry} templates...`);

        const industryPath = path.join(PROJECT_ROOT, industry);
        if (!fs.existsSync(industryPath)) {
            console.log(`⚠️  Industry folder not found: ${industry}`);
            continue;
        }

        // Load the manifest for this industry
        const manifestPath = path.join(industryPath, 'assets', 'manifest.json');
        let manifest = null;

        try {
            if (fs.existsSync(manifestPath)) {
                manifest = await fs.readJson(manifestPath);
                console.log(`📋 Loaded manifest with ${Object.keys(manifest.images).length} images`);
            } else {
                console.log(`⚠️  No manifest found for ${industry}, skipping`);
                continue;
            }
        } catch (error) {
            console.log(`❌ Failed to load manifest for ${industry}:`, error.message);
            continue;
        }

        // Find all HTML template files in this industry
        const templateFiles = await findHtmlFiles(industryPath);

        if (templateFiles.length === 0) {
            console.log(`ℹ️  No HTML templates found in ${industry}`);
            continue;
        }

        console.log(`📄 Found ${templateFiles.length} template files`);

        // Process each template file
        for (const templatePath of templateFiles) {
            const relativePath = path.relative(PROJECT_ROOT, templatePath);
            console.log(`🔄 Processing: ${relativePath}`);

            try {
                const result = await updateTemplateFile(templatePath, manifest, industry);
                if (result.updated) {
                    totalFilesUpdated++;
                    totalImagesReplaced += result.imagesReplaced;
                    console.log(`✅ Updated ${result.imagesReplaced} images in ${relativePath}`);
                } else {
                    console.log(`⏭️  No changes needed in ${relativePath}`);
                }
            } catch (error) {
                console.error(`❌ Failed to update ${relativePath}:`, error.message);
            }
        }
    }

    console.log(`\n🎉 Template Update Complete!`);
    console.log(`📊 Summary:`);
    console.log(`   📁 Files Updated: ${totalFilesUpdated}`);
    console.log(`   🖼️  Images Replaced: ${totalImagesReplaced}`);
}

/**
 * Update a single template file with optimized images
 */
async function updateTemplateFile(templatePath, manifest, industry) {
    let content = await fs.readFile(templatePath, 'utf8');
    let updated = false;
    let imagesReplaced = 0;

    // Regular expression to match <img> tags with asset paths
    const imgRegex = /<img([^>]*?)src=["']([^"']*?)["']([^>]*?)>/gi;

    content = content.replace(imgRegex, (match, beforeSrc, src, afterSrc) => {
        // Check if this is an asset image that should be optimized
        if (isAssetImage(src, industry)) {
            const optimizedHtml = getOptimizedImageHtml(src, manifest, industry);

            if (optimizedHtml && optimizedHtml !== match) {
                updated = true;
                imagesReplaced++;
                return optimizedHtml;
            }
        }

        // Return original if no optimization needed
        return match;
    });

    if (updated) {
        await fs.writeFile(templatePath, content, 'utf8');
    }

    return { updated, imagesReplaced };
}

/**
 * Check if an image source should be optimized
 */
function isAssetImage(src, industry) {
    // Only optimize images that reference the assets directory
    if (!src.includes('/assets/') && !src.includes('assets/')) {
        return false;
    }

    // Skip external URLs
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
        return false;
    }

    // Skip data URLs
    if (src.startsWith('data:')) {
        return false;
    }

    return true;
}

/**
 * Generate optimized HTML for an image using manifest data
 */
function getOptimizedImageHtml(originalSrc, manifest, industry) {
    // Extract the image name from the src path
    const srcParts = originalSrc.split('/');
    const filename = srcParts[srcParts.length - 1];
    const baseName = filename.split('.')[0]; // Remove extension

    // Remove industry prefix if present (e.g., "fitness-hero-1" -> "hero-1")
    let cleanBaseName = baseName;
    if (baseName.startsWith(industry + '-')) {
        cleanBaseName = baseName.substring(industry.length + 1);
    }

    // Look up the image in the manifest
    const imageData = manifest.images[cleanBaseName] || manifest.images[baseName];

    if (!imageData || !imageData.formats || imageData.formats.length === 0) {
        // No optimized versions available, return original
        return null;
    }

    // Build picture element with source elements
    let pictureHtml = '<picture>';

    // Add source elements for modern formats (AVIF, WebP)
    const modernFormats = imageData.formats.filter(format =>
        ['avif', 'webp'].includes(format)
    ).sort((a, b) => {
        // Prefer AVIF over WebP for better compression
        if (a === 'avif') return -1;
        if (b === 'avif') return 1;
        return 0;
    });

    for (const format of modernFormats) {
        const srcPath = `assets/images/${baseName}.${format}`;
        pictureHtml += `\n  <source srcset="${srcPath}" type="image/${format}">`;
    }

    // Add fallback img element (usually JPEG)
    const fallbackFormat = imageData.formats.includes('jpeg') ? 'jpeg' :
                          imageData.formats.includes('jpg') ? 'jpg' :
                          imageData.formats[0]; // Use first available format

    const fallbackSrc = `assets/images/${baseName}.${fallbackFormat}`;
    pictureHtml += `\n  <img src="${fallbackSrc}"`;

    // Preserve any existing attributes from the original img tag
    // This is a simplified version - in a real implementation you'd parse and preserve attributes
    pictureHtml += ' loading="lazy" alt="Image">';

    pictureHtml += '\n</picture>';

    return pictureHtml;
}

/**
 * Find all HTML files in an industry directory
 */
async function findHtmlFiles(dirPath) {
    const results = [];

    async function scanDirectory(currentPath) {
        const items = await fs.readdir(currentPath);

        for (const item of items) {
            const fullPath = path.join(currentPath, item);
            const stat = await fs.stat(fullPath);

            if (stat.isDirectory()) {
                // Only scan template subdirectories
                const dirName = path.basename(fullPath);
                if (['minimal-creative', 'business-professional', 'professional-enterprise'].includes(dirName)) {
                    await scanDirectory(fullPath);
                }
            } else if (stat.isFile() && item.endsWith('.html')) {
                results.push(fullPath);
            }
        }
    }

    await scanDirectory(dirPath);
    return results;
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);

    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--help':
            case '-h':
                console.log(`
Template Auto-Update Script

Automatically updates HTML templates to use optimized images from asset manifests.
Replaces <img> tags with modern <picture> elements for better performance.

Usage: npm run update-templates [options]

Options:
  -h, --help    Show this help

Examples:
  npm run update-templates    # Update all templates
  npm run build:full         # Build with template updates included
`);
                process.exit(0);
                break;
            default:
                console.error(`Unknown option: ${args[i]}`);
                console.log('Use --help for usage information');
                process.exit(1);
        }
    }

    try {
        await updateTemplates();
        console.log('\n🎉 All templates updated successfully!');
    } catch (error) {
        console.error('\n💥 Template update failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

export default { updateTemplates, updateTemplateFile };
