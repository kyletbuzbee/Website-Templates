#!/usr/bin/env node

/**
 * Asset Optimization Script
 * Handles image compression, font optimization, and asset processing
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const sharp = require('sharp');
const { optimize: svgoOptimize } = require('svgo');

// Configuration
const config = {
  // Source directories
  src: {
    images: 'assets/images/**/*.{jpg,jpeg,png,gif,svg}',
    fonts: 'assets/fonts/**/*.{woff,woff2,ttf,otf,eot}',
    templates: 'industries/**/assets/demo-content.json'
  },

  // Output directories
  dist: {
    images: 'dist/assets/images',
    fonts: 'dist/assets/fonts',
    reports: 'reports'
  },

  // Image optimization settings
  images: {
    jpeg: {
      quality: 85,
      progressive: true
    },
    png: {
      quality: [0.6, 0.8],
      speed: 1
    },
    webp: {
      quality: 85,
      lossless: false
    },
    svg: {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
              cleanupIDs: false
            }
          }
        }
      ]
    }
  },

  // Font optimization settings
  fonts: {
    subsets: ['latin', 'latin-ext'],
    formats: ['woff2', 'woff']
  }
};

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Get file size in human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Optimize images
 */
async function optimizeImages() {
  console.log('🔍 Finding images to optimize...');

  const imageFiles = await glob(config.src.images);
  console.log(`📁 Found ${imageFiles.length} images`);

  if (imageFiles.length === 0) {
    console.log('⚠️  No images found to optimize');
    return;
  }

  ensureDir(config.dist.images);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  const results = [];

  for (const file of imageFiles) {
    const relativePath = path.relative('assets', file);
    const outputPath = path.join(config.dist.images, relativePath);

    // Ensure output directory exists
    ensureDir(path.dirname(outputPath));

    const originalStats = fs.statSync(file);
    totalOriginalSize += originalStats.size;

    try {
      const ext = path.extname(file).toLowerCase();

      if (ext === '.svg') {
        // Optimize SVG using SVGO directly
        const svgContent = fs.readFileSync(file, 'utf8');
        const optimizedSvg = svgoOptimize(svgContent, {
          plugins: config.images.svg.plugins
        });

        fs.writeFileSync(outputPath, optimizedSvg.data);
        const optimizedStats = fs.statSync(outputPath);
        totalOptimizedSize += optimizedStats.size;

        results.push({
          file: relativePath,
          original: originalStats.size,
          optimized: optimizedStats.size,
          savings: originalStats.size - optimizedStats.size,
          percentage: ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(1)
        });
      } else {
        // Optimize raster images
        let sharpInstance = sharp(file);

        // Get image info
        const metadata = await sharpInstance.metadata();

        // Apply optimizations based on format
        if (ext === '.jpg' || ext === '.jpeg') {
          sharpInstance = sharpInstance.jpeg(config.images.jpeg);
        } else if (ext === '.png') {
          sharpInstance = sharpInstance.png({ compressionLevel: 9 });
        }

        // Resize if too large (max 1920px width for web)
        if (metadata.width > 1920) {
          sharpInstance = sharpInstance.resize(1920, null, {
            withoutEnlargement: true,
            fit: 'inside'
          });
        }

        // Save optimized image
        await sharpInstance.toFile(outputPath);

        // Create WebP version for modern browsers
        if (ext !== '.gif') {
          const webpPath = outputPath.replace(ext, '.webp');
          await sharp(file)
            .webp(config.images.webp)
            .toFile(webpPath);
        }

        const optimizedStats = fs.statSync(outputPath);
        totalOptimizedSize += optimizedStats.size;

        results.push({
          file: relativePath,
          original: originalStats.size,
          optimized: optimizedStats.size,
          savings: originalStats.size - optimizedStats.size,
          percentage: ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(1)
        });
      }
    } catch (error) {
      console.error(`❌ Error optimizing ${file}:`, error.message);
    }
  }

  // Generate report
  const reportPath = path.join(config.dist.reports, 'image-optimization-report.json');
  ensureDir(config.dist.reports);

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: results.length,
      totalOriginalSize: totalOriginalSize,
      totalOptimizedSize: totalOptimizedSize,
      totalSavings: totalOriginalSize - totalOptimizedSize,
      averageSavingsPercentage: ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)
    },
    files: results
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('✅ Image optimization complete!');
  console.log(`📊 Total savings: ${formatBytes(totalOriginalSize - totalOptimizedSize)} (${report.summary.averageSavingsPercentage}% reduction)`);
  console.log(`📄 Report saved to: ${reportPath}`);
}

/**
 * Optimize fonts
 */
async function optimizeFonts() {
  console.log('🔤 Optimizing fonts...');

  const fontFiles = await glob(config.src.fonts);
  console.log(`📁 Found ${fontFiles.length} font files`);

  if (fontFiles.length === 0) {
    console.log('⚠️  No fonts found to optimize');
    return;
  }

  ensureDir(config.dist.fonts);

  // For now, just copy fonts (advanced font optimization would require font tools)
  // In a production environment, you might use fonttools, woff2, etc.
  for (const file of fontFiles) {
    const relativePath = path.relative('assets', file);
    const outputPath = path.join(config.dist.fonts, relativePath);

    ensureDir(path.dirname(outputPath));
    fs.copyFileSync(file, outputPath);
  }

  console.log('✅ Font optimization complete!');
}

/**
 * Generate font loading CSS
 */
function generateFontCSS() {
  console.log('📝 Generating font loading CSS...');

  const fontCSS = `
/* Font Loading Optimization */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url('./assets/fonts/inter-300.woff2') format('woff2'),
       url('./assets/fonts/inter-300.woff') format('woff');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('./assets/fonts/inter-400.woff2') format('woff2'),
       url('./assets/fonts/inter-400.woff') format('woff');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('./assets/fonts/inter-500.woff2') format('woff2'),
       url('./assets/fonts/inter-500.woff') format('woff');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('./assets/fonts/inter-600.woff2') format('woff2'),
       url('./assets/fonts/inter-600.woff') format('woff');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('./assets/fonts/inter-700.woff2') format('woff2'),
       url('./assets/fonts/inter-700.woff') format('woff');
}

/* Font loading classes */
.font-loading {
  visibility: hidden;
}

.font-loaded {
  visibility: visible;
}

/* Preload critical fonts */
<link rel="preload" href="./assets/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="./assets/fonts/inter-600.woff2" as="font" type="font/woff2" crossorigin>
`;

  const fontCSSPath = path.join('src', 'styles', 'fonts.css');
  ensureDir(path.dirname(fontCSSPath));
  fs.writeFileSync(fontCSSPath, fontCSS);

  console.log('✅ Font CSS generated!');
}

/**
 * Validate template assets
 */
async function validateTemplates() {
  console.log('🔍 Validating template assets...');

  const templateFiles = await glob(config.src.templates);
  console.log(`📁 Found ${templateFiles.length} template files`);

  const issues = [];

  for (const file of templateFiles) {
    try {
      const content = JSON.parse(fs.readFileSync(file, 'utf8'));
      const templateName = path.basename(path.dirname(path.dirname(file)));

      // Check for missing image references
      const imageFields = ['logo', 'favicon', 'hero.image', 'about.image'];
      const missingImages = [];

      imageFields.forEach(field => {
        const keys = field.split('.');
        let value = content;
        for (const key of keys) {
          value = value?.[key];
        }
        if (value && !fs.existsSync(path.join('assets', value))) {
          missingImages.push(field);
        }
      });

      if (missingImages.length > 0) {
        issues.push({
          template: templateName,
          file: path.relative(process.cwd(), file),
          type: 'missing_images',
          details: `Missing images: ${missingImages.join(', ')}`
        });
      }

      // Check for SEO fields
      if (!content.seo?.meta_description) {
        issues.push({
          template: templateName,
          file: path.relative(process.cwd(), file),
          type: 'missing_seo',
          details: 'Missing meta description'
        });
      }

    } catch (error) {
      issues.push({
        template: path.basename(path.dirname(path.dirname(file))),
        file: path.relative(process.cwd(), file),
        type: 'json_error',
        details: error.message
      });
    }
  }

  if (issues.length > 0) {
    console.log('⚠️  Found validation issues:');
    issues.forEach(issue => {
      console.log(`  - ${issue.template}: ${issue.details}`);
    });

    // Save validation report
    const reportPath = path.join(config.dist.reports, 'validation-report.json');
    ensureDir(config.dist.reports);
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      issues: issues
    }, null, 2));

    console.log(`📄 Validation report saved to: ${reportPath}`);
  } else {
    console.log('✅ All templates validated successfully!');
  }
}

/**
 * Generate asset manifest
 */
async function generateManifest() {
  console.log('📋 Generating asset manifest...');

  const manifest = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    assets: {}
  };

  // Get all optimized assets
  const assetDirs = [
    { dir: config.dist.images, type: 'images' },
    { dir: config.dist.fonts, type: 'fonts' }
  ];

  for (const { dir, type } of assetDirs) {
    if (fs.existsSync(dir)) {
      const files = await glob(`${dir}/**/*`, { nodir: true });
      manifest.assets[type] = files.map(file => ({
        path: path.relative('dist', file),
        size: fs.statSync(file).size,
        hash: require('crypto').createHash('md5').update(fs.readFileSync(file)).digest('hex').substring(0, 8)
      }));
    }
  }

  const manifestPath = path.join('dist', 'asset-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('✅ Asset manifest generated!');
}

/**
 * Main optimization function
 */
async function main() {
  console.log('🚀 Starting asset optimization...\n');

  try {
    // Create output directories
    ensureDir(config.dist.images);
    ensureDir(config.dist.fonts);
    ensureDir(config.dist.reports);

    // Run optimizations
    await optimizeImages();
    console.log('');

    await optimizeFonts();
    console.log('');

    generateFontCSS();
    console.log('');

    await validateTemplates();
    console.log('');

    await generateManifest();
    console.log('');

    console.log('🎉 Asset optimization complete!');

  } catch (error) {
    console.error('❌ Asset optimization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  optimizeImages,
  optimizeFonts,
  generateFontCSS,
  validateTemplates,
  generateManifest
};
