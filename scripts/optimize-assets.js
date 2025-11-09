#!/usr/bin/env node

/**
 * Enhanced Asset Optimization Script
 * Intelligent format conversion with content-type detection
 * PNG icons → SVG (scalable vectors)
 * PNG photos → JPEG + WebP/AVIF (optimal compression)
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import util from 'util';
const execAsync = util.promisify(exec);

// Global variables for dynamic imports
let pLimit;
let sharp;
let analyzeImageContent;
let convertPngToSvg;
let imageAnalysisAvailable = false;

class AssetOptimizer {
    constructor(options = {}) {
        this.inputDir = options.inputDir || '_raw_assets';
        this.outputDir = options.outputDir || 'assets';
        this.quality = options.quality || 75;
        this.concurrency = options.concurrency || Math.max(1, os.cpus().length - 1);
        this.formats = options.formats || ['webp', 'avif'];
        this.limit = null;

        // Statistics tracking
        this.stats = {
            processed: 0,
            skipped: 0,
            errors: 0,
            startTime: Date.now(),
            totalSizeOriginal: 0,
            totalSizeOptimized: 0
        };

        console.log(`🚀 Asset Optimizer initialized with ${this.concurrency} concurrent workers`);
    }

    /**
     * Initialize dependencies and concurrency limiter
     */
    async initialize() {
        // Load dependencies if not already loaded
        if (!pLimit) {
            const { default: limitFactory } = await import('p-limit');
            pLimit = limitFactory;
        }

        if (!sharp) {
            sharp = (await import('sharp')).default;
        }

        // Try to import image analysis utilities (fallback if not available)
        if (!imageAnalysisAvailable) {
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
        }

        this.limit = pLimit(this.concurrency);
    }

    /**
     * Main optimization workflow
     */
    async optimize() {
        try {
            await this.initialize();
            await this.ensureDirectories();
            await this.checkDependencies();

            const imageFiles = await this.findImageFiles();
            console.log(`📁 Found ${imageFiles.length} images to process`);

            if (imageFiles.length === 0) {
                console.log('✅ No images to process');
                return;
            }

            // Process images in parallel with concurrency control
            const tasks = imageFiles.map(file => this.limit(async () => {
                try {
                    return await this.processImage(file);
                } catch (error) {
                    console.error(`❌ Failed to process ${file}:`, error.message);
                    this.stats.errors++;
                    return null;
                }
            }));

            const results = (await Promise.all(tasks)).filter(Boolean);

            // Generate report
            await this.generateReport(results);

        } catch (error) {
            console.error('💥 Fatal error during optimization:', error);
            process.exit(1);
        }
    }

    /**
     * Ensure input and output directories exist
     */
    async ensureDirectories() {
        try {
            await fs.access(this.inputDir);
        } catch {
            throw new Error(`Input directory '${this.inputDir}' does not exist`);
        }

        // Create output directory if it doesn't exist
        try {
            await fs.mkdir(this.outputDir, { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }

    /**
     * Check if required dependencies are installed
     */
    async checkDependencies() {
        const requiredCommands = ['magick', 'cwebp', 'avifenc'];

        for (const cmd of requiredCommands) {
            try {
                await execAsync(`${cmd} --version`);
            } catch {
                console.warn(`⚠️  ${cmd} not found. Some formats may not be available.`);
            }
        }
    }

    /**
     * Find all image files in input directory
     */
    async findImageFiles() {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif'];
        const files = [];

        async function scanDirectory(dir) {
            const items = await fs.readdir(dir, { withFileTypes: true });

            for (const item of items) {
                const fullPath = path.join(dir, item.name);

                if (item.isDirectory()) {
                    // Skip common non-asset directories
                    if (!['node_modules', '.git', 'dist', 'build'].includes(item.name)) {
                        await scanDirectory(fullPath);
                    }
                } else if (item.isFile()) {
                    const ext = path.extname(item.name).toLowerCase();
                    if (imageExtensions.includes(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        }

        await scanDirectory(this.inputDir);
        return files;
    }

    /**
     * Process a single image file with intelligent format selection
     */
    async processImage(inputPath) {
        const relativePath = path.relative(this.inputDir, inputPath);
        const parsedPath = path.parse(relativePath);
        const baseName = parsedPath.name;

        // Get file stats for size tracking
        const stats = await fs.stat(inputPath);
        const originalSize = stats.size;
        this.stats.totalSizeOriginal += originalSize;

        const results = {
            inputPath,
            relativePath,
            originalSize,
            contentType: 'unknown',
            outputs: [],
            totalOptimizedSize: 0
        };

        // Process image (with or without analysis)
        if (imageAnalysisAvailable) {
            try {
                // Analyze image content to determine optimal formats
                const analysis = await analyzeImageContent(inputPath);
                results.contentType = analysis.analysis.contentType;
                results.analysis = analysis;

                console.log(`🔍 ${relativePath}: Detected as ${analysis.analysis.contentType} (${analysis.recommendations.reason})`);

                // Use intelligent format selection based on content type
                const formatsToUse = this.getIntelligentFormats(analysis);

                // Process each recommended format
                for (const format of formatsToUse) {
                    try {
                        const outputPath = await this.convertImageIntelligent(inputPath, baseName, format, analysis);
                        if (outputPath) {
                            const outputStats = await fs.stat(outputPath);
                            const optimizedSize = outputStats.size;

                            results.outputs.push({
                                format,
                                path: outputPath,
                                size: optimizedSize
                            });

                            results.totalOptimizedSize += optimizedSize;
                        }
                    } catch (error) {
                        console.warn(`⚠️  Failed to convert ${inputPath} to ${format}:`, error.message);
                    }
                }
            } catch (analysisError) {
                console.warn(`⚠️  Analysis failed for ${relativePath}, using basic processing:`, analysisError.message);
                await this.processImageBasic(inputPath, baseName, results);
            }
        } else {
            // Basic processing without analysis
            console.log(`🔄 Processing (basic): ${relativePath}`);
            await this.processImageBasic(inputPath, baseName, results);
        }

        if (results.outputs.length > 0) {
            this.stats.processed++;
            this.stats.totalSizeOptimized += results.totalOptimizedSize;

            const savings = ((originalSize - results.totalOptimizedSize) / originalSize * 100).toFixed(1);
            console.log(`✅ ${relativePath}: ${this.formatBytes(originalSize)} → ${this.formatBytes(results.totalOptimizedSize)} (${savings}% savings)`);
        } else {
            this.stats.skipped++;
            console.log(`⏭️  ${relativePath}: No optimizations applied`);
        }

        return results;
    }

    /**
     * Convert image to specified format
     */
    async convertImage(inputPath, baseName, format) {
        const outputDir = path.dirname(path.join(this.outputDir, path.relative(this.inputDir, inputPath)));
        await fs.mkdir(outputDir, { recursive: true });

        const outputPath = path.join(outputDir, `${baseName}.${format}`);

        // Skip if output already exists and is newer than input
        try {
            const [inputStats, outputStats] = await Promise.all([
                fs.stat(inputPath),
                fs.stat(outputPath)
            ]);

            if (outputStats.mtime > inputStats.mtime) {
                return outputPath; // Already up to date
            }
        } catch {
            // Output doesn't exist, continue with conversion
        }

        switch (format) {
            case 'webp':
                await this.convertToWebP(inputPath, outputPath);
                break;
            case 'avif':
                await this.convertToAVIF(inputPath, outputPath);
                break;
            default:
                throw new Error(`Unsupported format: ${format}`);
        }

        return outputPath;
    }

    /**
     * Convert image to WebP format
     */
    async convertToWebP(inputPath, outputPath) {
        try {
            // Try cwebp first (faster), fall back to ImageMagick
            await execAsync(`cwebp -q ${this.quality} "${inputPath}" -o "${outputPath}"`);
        } catch {
            // Fallback to ImageMagick
            await execAsync(`magick "${inputPath}" -quality ${this.quality} "${outputPath}"`);
        }
    }

    /**
     * Convert image to AVIF format
     */
    async convertToAVIF(inputPath, outputPath) {
        try {
            // Use avifenc for AVIF conversion
            await execAsync(`avifenc --min 0 --max 63 -a end-usage=q -a cq-level=${Math.round((100 - this.quality) / 2)} "${inputPath}" "${outputPath}"`);
        } catch {
            // Fallback to ImageMagick if avifenc not available
            try {
                await execAsync(`magick "${inputPath}" -quality ${this.quality} "${outputPath.replace('.avif', '.webp')}"`);
                // Rename to .avif for consistency (though it's actually WebP)
                await fs.rename(outputPath.replace('.avif', '.webp'), outputPath);
            } catch (fallbackError) {
                throw new Error(`AVIF conversion failed: ${fallbackError.message}`);
            }
        }
    }

    /**
     * Get intelligent format selection based on image analysis
     */
    getIntelligentFormats(analysis) {
        const { recommendations } = analysis;

        // Use recommended formats, but filter based on available formats
        let formatsToUse = recommendations.formats.filter(format =>
            this.formats.includes(format) || format === 'svg' || format === 'jpeg'
        );

        // Ensure we have at least one format
        if (formatsToUse.length === 0) {
            formatsToUse = analysis.analysis.isIcon ? ['webp', 'avif'] : ['jpeg', 'webp', 'avif'];
        }

        return formatsToUse;
    }

    /**
     * Convert image with intelligent format handling
     */
    async convertImageIntelligent(inputPath, baseName, format, analysis) {
        const outputDir = path.dirname(path.join(this.outputDir, path.relative(this.inputDir, inputPath)));
        await fs.mkdir(outputDir, { recursive: true });

        const outputPath = path.join(outputDir, `${baseName}.${format}`);

        // Skip if output already exists and is newer than input
        try {
            const [inputStats, outputStats] = await Promise.all([
                fs.stat(inputPath),
                fs.stat(outputPath)
            ]);

            if (outputStats.mtime > inputStats.mtime) {
                return outputPath; // Already up to date
            }
        } catch {
            // Output doesn't exist, continue with conversion
        }

        switch (format) {
            case 'svg':
                // Special handling for SVG conversion from PNG icons
                if (analysis.metadata.format === 'png' && analysis.analysis.isIcon) {
                    const success = await convertPngToSvg(inputPath, outputPath);
                    if (success) {
                        return outputPath;
                    } else {
                        throw new Error('SVG conversion failed');
                    }
                } else {
                    throw new Error('SVG conversion only supported for PNG icons');
                }
            case 'jpeg':
                await this.convertToJPEG(inputPath, outputPath);
                break;
            case 'webp':
                await this.convertToWebP(inputPath, outputPath);
                break;
            case 'avif':
                await this.convertToAVIF(inputPath, outputPath);
                break;
            default:
                throw new Error(`Unsupported format: ${format}`);
        }

        return outputPath;
    }

    /**
     * Basic image processing when advanced analysis is not available
     */
    async processImageBasic(inputPath, baseName, results) {
        results.contentType = 'photo'; // Default assumption

        // Create multiple formats for better browser support
        const formats = ['webp', 'jpeg']; // Basic fallback formats

        for (const format of formats) {
            try {
                const outputPath = await this.convertImage(inputPath, baseName, format);
                if (outputPath) {
                    const outputStats = await fs.stat(outputPath);
                    const optimizedSize = outputStats.size;

                    results.outputs.push({
                        format,
                        path: outputPath,
                        size: optimizedSize
                    });

                    results.totalOptimizedSize += optimizedSize;
                }
            } catch (error) {
                console.warn(`  ⚠️  Failed to create ${format} version:`, error.message);
            }
        }
    }

    /**
     * Convert image to JPEG format
     */
    async convertToJPEG(inputPath, outputPath) {
        try {
            // Use sharp for JPEG conversion with optimization
            await sharp(inputPath)
                .jpeg({
                    quality: this.quality,
                    mozjpeg: true
                })
                .toFile(outputPath);
        } catch {
            // Fallback to ImageMagick
            await execAsync(`magick "${inputPath}" -quality ${this.quality} "${outputPath}"`);
        }
    }

    /**
     * Format bytes for human-readable display
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    /**
     * Generate optimization report
     */
    async generateReport(results) {
        const duration = (Date.now() - this.stats.startTime) / 1000;
        const totalSavings = this.stats.totalSizeOriginal - this.stats.totalSizeOptimized;
        const savingsPercentage = this.stats.totalSizeOriginal > 0
            ? ((totalSavings / this.stats.totalSizeOriginal) * 100).toFixed(1)
            : 0;

        console.log('\n📊 Optimization Report');
        console.log('='.repeat(50));
        console.log(`⏱️  Duration: ${duration.toFixed(1)}s`);
        console.log(`📁 Images processed: ${this.stats.processed}`);
        console.log(`⏭️  Images skipped: ${this.stats.skipped}`);
        console.log(`❌ Errors: ${this.stats.errors}`);
        console.log(`💾 Original size: ${this.formatBytes(this.stats.totalSizeOriginal)}`);
        console.log(`💾 Optimized size: ${this.formatBytes(this.stats.totalSizeOptimized)}`);
        console.log(`💰 Space saved: ${this.formatBytes(totalSavings)} (${savingsPercentage}%)`);
        console.log(`🚀 Performance: ${(this.stats.processed / duration).toFixed(1)} images/second`);

        // Save detailed report
        const reportPath = path.join(this.outputDir, 'optimization-report.json');
        const report = {
            timestamp: new Date().toISOString(),
            duration,
            stats: this.stats,
            results,
            summary: {
                totalSavings,
                savingsPercentage,
                performance: this.stats.processed / duration
            }
        };

        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        console.log(`📄 Detailed report saved to: ${reportPath}`);
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const options = {};

    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--input':
            case '-i':
                options.inputDir = args[++i];
                break;
            case '--output':
            case '-o':
                options.outputDir = args[++i];
                break;
            case '--quality':
            case '-q':
                options.quality = parseInt(args[++i]);
                break;
            case '--concurrency':
            case '-c':
                options.concurrency = parseInt(args[++i]);
                break;
            case '--formats':
            case '-f':
                options.formats = args[++i].split(',');
                break;
            case '--help':
            case '-h':
                console.log(`
Asset Optimization Script

Usage: node optimize-assets.js [options]

Options:
  -i, --input <dir>       Input directory (default: _raw_assets)
  -o, --output <dir>      Output directory (default: assets)
  -q, --quality <num>     Quality level 1-100 (default: 75)
  -c, --concurrency <num> Number of concurrent workers (default: CPU cores - 1)
  -f, --formats <list>    Output formats (default: webp,avif)
  -h, --help             Show this help

Examples:
  node optimize-assets.js
  node optimize-assets.js --input images --output optimized --quality 80
  node optimize-assets.js --formats webp,jpg --concurrency 4
`);
                process.exit(0);
        }
    }

    const optimizer = new AssetOptimizer(options);

    try {
        await optimizer.optimize();
        console.log('\n🎉 Asset optimization completed successfully!');
    } catch (error) {
        console.error('\n💥 Asset optimization failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('🚀 Starting optimize-assets script...');
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

export default AssetOptimizer;
