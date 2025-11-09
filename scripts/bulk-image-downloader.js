#!/usr/bin/env node

/**
 * Bulk Image Downloader for Website Templates
 * Downloads images from websites and organizes them for the asset pipeline
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
    outputDir: path.join(PROJECT_ROOT, '_raw_assets'),
    tempDir: path.join(PROJECT_ROOT, '_raw_assets', 'temp'),
    industries: [
        'fitness', 'healthcare', 'contractors-trades', 'legal',
        'photography', 'restaurants', 'retail-ecommerce', 'roofing', 'real-estate'
    ]
};

/**
 * Download images using wget (most reliable for bulk downloads)
 */
async function downloadWithWget(url, outputPath, options = {}) {
    const { recursive = false, level = 1, accept = 'jpg,jpeg,png,webp' } = options;

    const wgetCommand = [
        'wget',
        recursive ? '-r' : '',
        recursive ? `-l ${level}` : '',
        `-P "${outputPath}"`,
        `-A "${accept}"`,
        '--no-clobber',
        '--no-parent',
        '--reject="index.html*"',
        '--quiet',
        `"${url}"`
    ].filter(Boolean).join(' ');

    try {
        console.log(`📥 Downloading from: ${url}`);
        const { stdout, stderr } = await execAsync(wgetCommand);
        return { success: true, stdout, stderr };
    } catch (error) {
        console.warn(`⚠️  wget failed for ${url}:`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Download images using gallery-dl (excellent for image galleries)
 */
async function downloadWithGalleryDl(url, outputPath, options = {}) {
    const { cookies = '', userAgent = '' } = options;

    // Build command array for better cross-platform compatibility
    const commandArgs = [
        'gallery-dl',
        '--directory', outputPath,
        '--filename', '{filename}.{extension}',
        '--quiet'
    ];

    if (cookies) {
        commandArgs.push('--cookies', cookies);
    }

    if (userAgent) {
        commandArgs.push('--user-agent', userAgent);
    }

    commandArgs.push(url);

    try {
        console.log(`🎨 Downloading gallery from: ${url}`);
        const { stdout, stderr } = await execAsync(commandArgs.join(' '));
        return { success: true, stdout, stderr };
    } catch (error) {
        console.warn(`⚠️  gallery-dl failed for ${url}:`, error.message);
        console.warn(`💡 Make sure gallery-dl is installed: pip install gallery-dl`);
        return { success: false, error: error.message };
    }
}

/**
 * Download single image with curl
 */
async function downloadSingleImage(url, outputPath) {
    const filename = path.basename(new URL(url).pathname);
    const outputFile = path.join(outputPath, filename);

    const curlCommand = [
        'curl',
        '-L', // follow redirects
        '-o', `"${outputFile}"`,
        '--silent',
        '--show-error',
        `"${url}"`
    ].join(' ');

    try {
        console.log(`🖼️  Downloading: ${filename}`);
        const { stdout, stderr } = await execAsync(curlCommand);
        return { success: true, filename, stdout, stderr };
    } catch (error) {
        console.warn(`⚠️  Failed to download ${url}:`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Rename downloaded images to follow naming convention
 */
async function renameImagesForIndustry(industry, imageDir) {
    console.log(`🔄 Renaming images for ${industry}...`);

    const files = await fs.readdir(imageDir);
    const imageFiles = files.filter(file =>
        ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
    );

    let renamedCount = 0;

    for (let i = 0; i < imageFiles.length; i++) {
        const oldPath = path.join(imageDir, imageFiles[i]);
        const ext = path.extname(imageFiles[i]).toLowerCase();

        // Create new filename: industry-description-number.ext
        const description = path.basename(imageFiles[i], ext)
            .replace(/[^a-zA-Z0-9]/g, '-')
            .toLowerCase();

        const newFilename = `${industry}-${description}-${i + 1}${ext}`;
        const newPath = path.join(imageDir, newFilename);

        try {
            await fs.rename(oldPath, newPath);
            console.log(`  ✅ ${imageFiles[i]} → ${newFilename}`);
            renamedCount++;
        } catch (error) {
            console.warn(`  ⚠️  Failed to rename ${imageFiles[i]}:`, error.message);
        }
    }

    console.log(`📊 Renamed ${renamedCount} images for ${industry}`);
    return renamedCount;
}

/**
 * Extract image URLs from HTML content
 */
async function extractImageUrls(htmlContent, baseUrl) {
    const imageUrls = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;

    while ((match = imgRegex.exec(htmlContent)) !== null) {
        let src = match[1];

        // Convert relative URLs to absolute
        if (!src.startsWith('http')) {
            const base = new URL(baseUrl);
            src = new URL(src, base).href;
        }

        // Filter for common image extensions
        if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(src)) {
            imageUrls.push(src);
        }
    }

    return imageUrls;
}

/**
 * Download images from a list of URLs
 */
async function downloadFromUrlList(urls, outputDir, concurrency = 5) {
    console.log(`📥 Downloading ${urls.length} images...`);

    // Process in batches to avoid overwhelming servers
    const batches = [];
    for (let i = 0; i < urls.length; i += concurrency) {
        batches.push(urls.slice(i, i + concurrency));
    }

    let successCount = 0;
    let errorCount = 0;

    for (const batch of batches) {
        const promises = batch.map(url => downloadSingleImage(url, outputDir));
        const results = await Promise.all(promises);

        results.forEach(result => {
            if (result.success) {
                successCount++;
            } else {
                errorCount++;
            }
        });
    }

    console.log(`✅ Downloaded: ${successCount} | Errors: ${errorCount}`);
    return { successCount, errorCount };
}

/**
 * Main CLI interface
 */
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        showHelp();
        return;
    }

    const command = args[0];

    switch (command) {
        case 'wget':
            await handleWgetCommand(args.slice(1));
            break;

        case 'gallery':
            await handleGalleryCommand(args.slice(1));
            break;

        case 'urls':
            await handleUrlsCommand(args.slice(1));
            break;

        case 'single':
            await handleSingleCommand(args.slice(1));
            break;

        case 'rename':
            await handleRenameCommand(args.slice(1));
            break;

        case 'browser':
            showBrowserInstructions(args.slice(1));
            break;

        default:
            console.error(`❌ Unknown command: ${command}`);
            showHelp();
    }
}

/**
 * Handle wget command for recursive website downloads
 */
async function handleWgetCommand(args) {
    const [url, industry, options = ''] = args;

    if (!url || !industry) {
        console.error('❌ Usage: npm run bulk-download wget <url> <industry> [options]');
        console.error('Example: npm run bulk-download wget https://example.com/images fitness --level=2');
        return;
    }

    if (!CONFIG.industries.includes(industry)) {
        console.error(`❌ Invalid industry: ${industry}`);
        console.error(`Valid industries: ${CONFIG.industries.join(', ')}`);
        return;
    }

    // Parse options
    const parsedOptions = {};
    if (options.includes('--level=')) {
        parsedOptions.level = parseInt(options.match(/--level=(\d+)/)?.[1] || '1');
        parsedOptions.recursive = true;
    }

    const outputPath = path.join(CONFIG.outputDir, industry);
    await fs.ensureDir(outputPath);

    console.log(`🌐 Downloading images from ${url} for ${industry}...`);
    const result = await downloadWithWget(url, outputPath, parsedOptions);

    if (result.success) {
        console.log('✅ Download completed');
        await renameImagesForIndustry(industry, outputPath);
    } else {
        console.error('❌ Download failed');
    }
}

/**
 * Handle gallery-dl command for image galleries
 */
async function handleGalleryCommand(args) {
    const [url, industry] = args;

    if (!url || !industry) {
        console.error('❌ Usage: npm run bulk-download gallery <url> <industry>');
        console.error('Example: npm run bulk-download gallery https://unsplash.com/s/photos/fitness fitness');
        return;
    }

    if (!CONFIG.industries.includes(industry)) {
        console.error(`❌ Invalid industry: ${industry}`);
        console.error(`Valid industries: ${CONFIG.industries.join(', ')}`);
        return;
    }

    const outputPath = path.join(CONFIG.outputDir, industry);
    await fs.ensureDir(outputPath);

    console.log(`🎨 Downloading gallery from ${url} for ${industry}...`);
    const result = await downloadWithGalleryDl(url, outputPath);

    if (result.success) {
        console.log('✅ Gallery download completed');
        await renameImagesForIndustry(industry, outputPath);
    } else {
        console.error('❌ Gallery download failed');
    }
}

/**
 * Handle URLs command for downloading from a list of URLs
 */
async function handleUrlsCommand(args) {
    const [urlFile, industry] = args;

    if (!urlFile || !industry) {
        console.error('❌ Usage: npm run bulk-download urls <url-file> <industry>');
        console.error('Example: npm run bulk-download urls image-urls.txt fitness');
        return;
    }

    if (!CONFIG.industries.includes(industry)) {
        console.error(`❌ Invalid industry: ${industry}`);
        console.error(`Valid industries: ${CONFIG.industries.join(', ')}`);
        return;
    }

    // Read URLs from file
    const urlContent = await fs.readFile(urlFile, 'utf-8');
    const urls = urlContent.split('\n')
        .map(line => line.trim())
        .filter(line => line && line.startsWith('http'));

    if (urls.length === 0) {
        console.error('❌ No valid URLs found in file');
        return;
    }

    const outputPath = path.join(CONFIG.outputDir, industry);
    await fs.ensureDir(outputPath);

    console.log(`📋 Found ${urls.length} URLs to download for ${industry}`);
    await downloadFromUrlList(urls, outputPath);
    await renameImagesForIndustry(industry, outputPath);
}

/**
 * Handle single image download
 */
async function handleSingleCommand(args) {
    const [url, industry, filename] = args;

    if (!url || !industry) {
        console.error('❌ Usage: npm run bulk-download single <url> <industry> [filename]');
        return;
    }

    if (!CONFIG.industries.includes(industry)) {
        console.error(`❌ Invalid industry: ${industry}`);
        console.error(`Valid industries: ${CONFIG.industries.join(', ')}`);
        return;
    }

    const outputPath = path.join(CONFIG.outputDir, industry);
    await fs.ensureDir(outputPath);

    const result = await downloadSingleImage(url, outputPath);

    if (result.success && filename) {
        // Rename if custom filename provided
        const oldPath = path.join(outputPath, result.filename);
        const newPath = path.join(outputPath, filename);
        await fs.rename(oldPath, newPath);
        console.log(`✅ Renamed to: ${filename}`);
    }

    if (result.success) {
        await renameImagesForIndustry(industry, outputPath);
    }
}

/**
 * Handle rename command for existing images
 */
async function handleRenameCommand(args) {
    const [industry] = args;

    if (!industry) {
        console.error('❌ Usage: npm run bulk-download rename <industry>');
        console.error('Example: npm run bulk-download rename fitness');
        return;
    }

    if (!CONFIG.industries.includes(industry)) {
        console.error(`❌ Invalid industry: ${industry}`);
        console.error(`Valid industries: ${CONFIG.industries.join(', ')}`);
        return;
    }

    const industryDir = path.join(CONFIG.outputDir, industry);

    if (!fs.existsSync(industryDir)) {
        console.error(`❌ Industry directory not found: ${industryDir}`);
        return;
    }

    await renameImagesForIndustry(industry, industryDir);
}

/**
 * Show browser-based bulk download instructions
 */
function showBrowserInstructions(args) {
    const [industry] = args;

    if (!industry || !CONFIG.industries.includes(industry)) {
        console.error(`❌ Please specify a valid industry: ${CONFIG.industries.join(', ')}`);
        console.error('Example: npm run bulk-download browser fitness');
        return;
    }

    const outputPath = path.join(CONFIG.outputDir, industry);

    console.log(`
🌐 BROWSER-BASED BULK IMAGE DOWNLOAD
Industry: ${industry}
Output: ${outputPath}

STEP 1: Install Browser Extension
─────────────────────────────────
Chrome: "Image Downloader" by Google
Firefox: "Image Downloader" by Google
Edge: "Image Downloader" by Google

STEP 2: Navigate to Image Source
─────────────────────────────────
• Unsplash: https://unsplash.com/s/photos/${industry.replace('-', '-')}
• Pexels: https://pexels.com/search/${industry.replace('-', '%20')}
• Pixabay: https://pixabay.com/images/search/${industry.replace('-', '%20')}

STEP 3: Download Images
───────────────────────
1. Click extension icon in browser
2. Select "Download all images" or "Download selected"
3. Choose destination folder
4. Wait for downloads to complete

STEP 4: Organize for Pipeline
─────────────────────────────
1. Move downloaded images to: ${outputPath}
2. Run: npm run bulk-download rename ${industry}
3. Run: npm run distribute-assets

ALTERNATIVE: Manual Download
───────────────────────────
1. Right-click images → "Save image as..."
2. Save to: ${outputPath}
3. Continue with Step 4 above

PRO TIPS:
• Use Incognito/Private mode to avoid login prompts
• Check image sizes before downloading (aim for 1-5MB each)
• Avoid watermarked or low-quality images
• Respect website terms of service

Once images are in ${outputPath}, run:
  npm run bulk-download rename ${industry}
  npm run distribute-assets
`);
}

/**
 * Show help information
 */
function showHelp() {
    const isWindows = process.platform === 'win32';

    console.log(`
🚀 Bulk Image Downloader for Website Templates

USAGE:
  npm run bulk-download <command> [options]

COMMANDS:
  wget <url> <industry> [options]    Download recursively from website
  gallery <url> <industry>           Download from image galleries (Unsplash, etc.)
  urls <file> <industry>             Download from list of URLs in file
  single <url> <industry> [name]     Download single image
  browser <industry>                 Show browser-based download instructions
  rename <industry>                  Rename existing images for industry

INDUSTRIES:
  ${CONFIG.industries.join(', ')}

EXAMPLES:
  # Download all images from a website (recursive)
  npm run bulk-download wget https://example.com/images fitness --level=2

  # Download from Unsplash gallery
  npm run bulk-download gallery https://unsplash.com/s/photos/fitness fitness

  # Download from URL list
  npm run bulk-download urls my-images.txt contractors-trades

  # Download single image
  npm run bulk-download single https://example.com/image.jpg fitness hero-1

  # Rename existing images
  npm run bulk-download rename healthcare

${isWindows ? 'WINDOWS INSTALLATION:' : 'LINUX/MAC INSTALLATION:'}
${isWindows ?
  `  # Using Chocolatey (recommended)
  choco install wget curl

  # Using pip for gallery-dl
  pip install gallery-dl

  # Alternative: Use WSL2 with Ubuntu` :

  `  # Ubuntu/Debian
  sudo apt-get install wget curl
  pip install gallery-dl

  # macOS
  brew install wget curl
  pip install gallery-dl`
}

WORKFLOW:
  1. Download images using any command above
  2. Images are automatically renamed to: industry-description-number.ext
  3. Run: npm run distribute-assets
  4. Optimized images appear in: industry/assets/images/

TIPS:
  - Use gallery-dl for image galleries and stock photo sites
  - Use wget for websites with many images
  - Use urls for curated image lists
  - Respect website terms of service and robots.txt

${isWindows ? 'WINDOWS NOTES:' : ''}
${isWindows ?
  `  - If gallery-dl fails, try: pip install gallery-dl
  - For WSL users: Install tools in WSL, not Windows
  - Alternative: Use browser extensions for manual bulk downloads` : ''
}
`);
}

// Run the CLI
main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});
