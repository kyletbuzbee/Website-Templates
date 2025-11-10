#!/usr/bin/env node

/**
 * Comprehensive Template Asset Audit
 * Lists all images and icons required for each template
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

async function auditTemplateAssets() {
  console.log('🔍 Starting Comprehensive Template Asset Audit...\n');

  const industries = await getIndustryFolders();
  const assetInventory = {};

  for (const industry of industries) {
    console.log(`📁 Auditing ${industry} templates...`);
    assetInventory[industry] = await auditIndustryAssets(industry);
  }

  // Generate comprehensive report
  await generateAssetReport(assetInventory);

  console.log('🎉 Asset audit complete!');
  console.log('📋 Check the generated asset-inventory.json and asset-report.md files');
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

async function auditIndustryAssets(industry) {
  const industryPath = path.join(PROJECT_ROOT, industry);
  const templateFolders = ['minimal-creative', 'business-professional', 'professional-enterprise'];
  const industryAssets = {};

  for (const templateFolder of templateFolders) {
    const templatePath = path.join(industryPath, templateFolder);
    const indexPath = path.join(templatePath, 'index.html');

    if (!await fs.pathExists(indexPath)) {
      continue;
    }

    const assets = await extractTemplateAssets(indexPath, industry, templateFolder);
    industryAssets[templateFolder] = assets;
  }

  return industryAssets;
}

async function extractTemplateAssets(templatePath, industry, templateType) {
  const htmlContent = await fs.readFile(templatePath, 'utf-8');

  const assets = {
    images: [],
    icons: [],
    missing: [],
    existing: []
  };

  // Extract all image references
  const imgRegex = /<img[^>]+src="([^"]+)"/g;
  let match;

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const src = match[1];

    // Skip external URLs and data URIs
    if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('//')) {
      continue;
    }

    // Convert relative paths to absolute paths
    let absolutePath = src;
    if (src.startsWith('../')) {
      absolutePath = path.resolve(path.dirname(templatePath), src);
    }

    // Check if file exists
    const exists = await fs.pathExists(absolutePath);

    const imageInfo = {
      src: src,
      absolutePath: absolutePath,
      exists: exists,
      type: getImageType(src),
      category: categorizeImage(src, industry)
    };

    assets.images.push(imageInfo);

    if (exists) {
      assets.existing.push(imageInfo);
    } else {
      assets.missing.push(imageInfo);
    }
  }

  // Extract icon references (both <icon-element> and <img> with icon classes)
  const iconRegex = /<icon-element[^>]+name="([^"]+)"/g;
  while ((match = iconRegex.exec(htmlContent)) !== null) {
    const name = match[1];
    assets.icons.push({
      name: name,
      type: 'icon-element',
      exists: true // Icons are handled by the Icon component
    });
  }

  // Extract service icons (img tags with service-icon-img class)
  const serviceIconRegex = /<img[^>]+class="[^"]*service-icon-img[^"]*"[^>]+src="([^"]+)"/g;
  while ((match = serviceIconRegex.exec(htmlContent)) !== null) {
    const src = match[1];
    assets.icons.push({
      src: src,
      type: 'service-icon',
      exists: await fs.pathExists(path.resolve(path.dirname(templatePath), src))
    });
  }

  // Extract contact icons
  const contactIconRegex = /<img[^>]+class="[^"]*contact-icon-img[^"]*"[^>]+src="([^"]+)"/g;
  while ((match = contactIconRegex.exec(htmlContent)) !== null) {
    const src = match[1];
    assets.icons.push({
      src: src,
      type: 'contact-icon',
      exists: await fs.pathExists(path.resolve(path.dirname(templatePath), src))
    });
  }

  return assets;
}

function getImageType(src) {
  const ext = path.extname(src).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext)) {
    return 'raster';
  } else if (['.svg', '.webp'].includes(ext)) {
    return 'vector';
  }
  return 'unknown';
}

function categorizeImage(src, industry) {
  const filename = path.basename(src).toLowerCase();

  // Hero images
  if (filename.includes('hero') || filename.includes('banner') || filename.includes('background')) {
    return 'hero';
  }

  // Team/About images
  if (filename.includes('team') || filename.includes('about') || filename.includes('staff') ||
      filename.includes('professional') || filename.includes('doctor') || filename.includes('attorney')) {
    return 'team';
  }

  // Avatar/Profile images
  if (filename.includes('avatar') || filename.includes('profile') || filename.includes('testimonial') ||
      filename.includes('client') || filename.includes('person')) {
    return 'avatar';
  }

  // Property images
  if (filename.includes('property') || filename.includes('house') || filename.includes('building') ||
      filename.includes('real-estate') || filename.includes('apartment') || filename.includes('commercial')) {
    return 'property';
  }

  // Work/Project images
  if (filename.includes('work') || filename.includes('project') || filename.includes('portfolio') ||
      filename.includes('service') || filename.includes('result') || filename.includes('gallery')) {
    return 'work';
  }

  // Gallery images
  if (filename.includes('gallery') || filename.includes('classes') || filename.includes('equipment') ||
      filename.includes('trainers') || filename.includes('facilities')) {
    return 'gallery';
  }

  return 'other';
}

async function generateAssetReport(assetInventory) {
  let markdownReport = '# 📋 Complete Template Asset Inventory\n\n';
  markdownReport += `Generated on: ${new Date().toISOString()}\n\n`;
  markdownReport += 'This report lists all images and icons required for each template.\n\n';

  let totalImages = 0;
  let totalIcons = 0;
  let totalMissing = 0;
  let totalExisting = 0;

  for (const [industry, templates] of Object.entries(assetInventory)) {
    markdownReport += `## 🏢 ${industry.charAt(0).toUpperCase() + industry.slice(1)}\n\n`;

    for (const [templateType, assets] of Object.entries(templates)) {
      markdownReport += `### ${templateType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n`;

      // Images section
      if (assets.images.length > 0) {
        markdownReport += `#### 🖼️ Images (${assets.images.length})\n\n`;
        markdownReport += '| Status | Path | Type | Category |\n';
        markdownReport += '|--------|------|------|----------|\n';

        for (const image of assets.images) {
          const status = image.exists ? '✅' : '❌';
          const type = image.type;
          const category = image.category;
          markdownReport += `| ${status} | \`${image.src}\` | ${type} | ${category} |\n`;
        }
        markdownReport += '\n';
      }

      // Icons section
      if (assets.icons.length > 0) {
        markdownReport += `#### 🎨 Icons (${assets.icons.length})\n\n`;
        markdownReport += '| Type | Name/Source | Status |\n';
        markdownReport += '|------|------------|--------|\n';

        for (const icon of assets.icons) {
          const type = icon.type;
          const name = icon.name || icon.src;
          const status = icon.exists ? '✅' : '❌';
          markdownReport += `| ${type} | \`${name}\` | ${status} |\n`;
        }
        markdownReport += '\n';
      }

      // Missing assets summary
      if (assets.missing.length > 0) {
        markdownReport += `#### ⚠️ Missing Assets (${assets.missing.length})\n\n`;
        for (const missing of assets.missing) {
          markdownReport += `- \`${missing.src}\` (${missing.category})\n`;
        }
        markdownReport += '\n';
      }

      totalImages += assets.images.length;
      totalIcons += assets.icons.length;
      totalMissing += assets.missing.length;
      totalExisting += assets.existing.length;
    }
  }

  // Summary section
  markdownReport += '## 📊 Summary\n\n';
  markdownReport += `| Metric | Count |\n`;
  markdownReport += `|--------|-------|\n`;
  markdownReport += `| Total Images | ${totalImages} |\n`;
  markdownReport += `| Total Icons | ${totalIcons} |\n`;
  markdownReport += `| Existing Assets | ${totalExisting} |\n`;
  markdownReport += `| Missing Assets | ${totalMissing} |\n`;
  markdownReport += `| Coverage | ${((totalExisting / (totalExisting + totalMissing)) * 100).toFixed(1)}% |\n\n`;

  // Save reports
  await fs.writeFile(path.join(PROJECT_ROOT, 'asset-report.md'), markdownReport);
  await fs.writeJson(path.join(PROJECT_ROOT, 'asset-inventory.json'), assetInventory, { spaces: 2 });

  console.log(`📊 Summary:`);
  console.log(`   🖼️  Total Images: ${totalImages}`);
  console.log(`   🎨 Total Icons: ${totalIcons}`);
  console.log(`   ✅ Existing Assets: ${totalExisting}`);
  console.log(`   ❌ Missing Assets: ${totalMissing}`);
  console.log(`   📈 Coverage: ${((totalExisting / (totalExisting + totalMissing)) * 100).toFixed(1)}%`);
}

// Run the audit
auditTemplateAssets().catch(error => {
  console.error('❌ Error auditing template assets:', error);
  process.exit(1);
});
