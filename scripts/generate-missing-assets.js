#!/usr/bin/env node

/**
 * Generate Missing Assets Script
 * Automatically creates all missing icons and placeholder images for templates
 */

import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// SVG icon templates for different categories
const ICON_SVG_TEMPLATES = {
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  envelope: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  location: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  home: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
  building: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><rect x="9" y="6" width="6" height="4"/><rect x="9" y="12" width="6" height="4"/><line x1="9" y1="18" x2="15" y2="18"/></svg>`,
  wrench: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  hammer: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 14.36a4 4 0 0 0-5.66 5.66l-1.48 1.48c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L14.36 17.64"/><path d="M20.91 11.7a6 6 0 0 0-8.49 8.49l-1.48 1.48c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L15.7 20.91"/><path d="M9 12l7-7"/></svg>`,
  hardhat: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6h0"/><path d="M14 6a6 6 0 0 1 6 6v3"/></svg>`,
  camera: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h1.586a1 1 0 0 1 .707.293l.707.707A1 1 0 0 0 13.414 11H15m-6 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  dumbbell: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.4 14.4 9.6 9.6m0 0L3 6l3.6-3.6L9.6 9.6m4.8 4.8L21 18l-3.6 3.6L14.4 14.4z"/><path d="M6 6l12 12"/></svg>`,
  stethoscope: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`,
  hospital: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l10 9H2l10-9z"/><path d="M9 22V12h6v10"/><path d="M2 22h20"/><path d="M7 6h.01"/><path d="M7 2h.01"/></svg>`,
  pill: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5h.01"/><path d="M13.5 3.5h.01"/><path d="M2 12a10 10 0 0 1 20 0"/><path d="M10.5 20.5a10 10 0 0 0 9-9.5"/><path d="M13.5 3.5a10 10 0 0 0-9 9.5"/></svg>`,
  bandage: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 12h.01"/><path d="M17 12h.01"/><path d="M11 10h2"/><path d="M11 14h2"/></svg>`,
  scale: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 5-5 0-1-.5-1.5-1-2"/><path d="M17 7h2c2 0 5-1 5-5 0-1-.5-1.5-1-2"/><path d="M6 7h12"/></svg>`,
  gavel: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  document: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>`,
  chef: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  coffee: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  utensils: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/><path d="M16 8h2"/></svg>`,
  cart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`
};

// Missing assets inventory - simplified to use SVG templates
const MISSING_ASSETS = {
  // Universal contact icons (needed by all templates)
  universal: [
    { name: 'contact-icon-phone.svg', template: 'phone' },
    { name: 'contact-icon-email.svg', template: 'envelope' },
    { name: 'contact-icon-location.svg', template: 'location' }
  ],

  // Industry-specific service icons
  'contractors-trades': [
    { name: 'contractors-trades-icon-contractor-icon-electrical.svg', template: 'wrench' },
    { name: 'contractors-trades-icon-contractor-icon-toolbox.svg', template: 'wrench' },
    { name: 'contractors-trades-icon-contractors-icon-hardhat.svg', template: 'hardhat' }
  ],

  fitness: [
    { name: 'fitness-icon-dumbbell.svg', template: 'dumbbell' },
    { name: 'fitness-icon-yoga.svg', template: 'heart' },
    { name: 'fitness-icon-treadmill.svg', template: 'heart' }
  ],

  healthcare: [
    { name: 'healthcare-hospital-medical-2.svg', template: 'hospital' },
    { name: 'healthcare-hospital-medical-5.svg', template: 'stethoscope' },
    { name: 'healthcare-hospital-medical-15.svg', template: 'pill' },
    { name: 'healthcare-hospital-medical-19.svg', template: 'heart' },
    { name: 'healthcare-hospital-medical-22.svg', template: 'bandage' }
  ],

  legal: [
    { name: 'legal-icon-scales.svg', template: 'scale' },
    { name: 'legal-icon-gavel.svg', template: 'gavel' },
    { name: 'legal-icon-document.svg', template: 'document' },
    { name: 'legal-icon-building.svg', template: 'building' }
  ],

  'real-estate': [
    { name: 'real-estate-icon-house.svg', template: 'home' },
    { name: 'real-estate-icon-building.svg', template: 'building' }
  ],

  restaurants: [
    { name: 'restaurants-utensils-1.svg', template: 'utensils' },
    { name: 'restaurants-coffee-3.svg', template: 'coffee' },
    { name: 'restaurants-plate-2.svg', template: 'chef' }
  ],

  photography: [
    { name: 'photography-camera-1.svg', template: 'camera' },
    { name: 'photography-lens-2.svg', template: 'camera' }
  ],

  roofing: [
    { name: 'roofing-house-1.svg', template: 'home' }
  ],

  'retail-ecommerce': [
    { name: 'ecommerce-cart-1.svg', template: 'cart' }
  ]
};

// Placeholder image generation settings
const PLACEHOLDER_SETTINGS = {
  team: { width: 800, height: 600, bgColor: '#f3f4f6', textColor: '#374151' },
  avatar: { width: 200, height: 200, bgColor: '#e5e7eb', textColor: '#6b7280' },
  property: { width: 600, height: 400, bgColor: '#dbeafe', textColor: '#1e40af' },
  work: { width: 600, height: 450, bgColor: '#ecfdf5', textColor: '#065f46' },
  hero: { width: 1920, height: 1080, bgColor: '#1e3a8a', textColor: '#ffffff' }
};

async function generateMissingAssets() {
  console.log('🎨 Starting Missing Asset Generation...\n');

  const industries = await getIndustryFolders();
  let totalGenerated = 0;

  // Generate universal contact icons first
  console.log('📞 Generating Universal Contact Icons...');
  for (const asset of MISSING_ASSETS.universal) {
    const generated = await generateIcon(asset);
    if (generated) {
      totalGenerated++;
      console.log(`   ✅ Generated: ${asset.name}`);
    }
  }

  // Generate industry-specific icons
  for (const industry of industries) {
    if (MISSING_ASSETS[industry]) {
      console.log(`🏭 Generating ${industry} Service Icons...`);

      for (const asset of MISSING_ASSETS[industry]) {
        const generated = await generateIcon(asset, industry);
        if (generated) {
          totalGenerated++;
          console.log(`   ✅ Generated: ${asset.name}`);
        }
      }
    }
  }

  // Generate placeholder images
  console.log('🖼️  Generating Placeholder Images...');
  const imageCount = await generatePlaceholderImages();
  totalGenerated += imageCount;

  console.log('🎉 Asset generation complete!');
  console.log(`📊 Generated ${totalGenerated} assets`);
  console.log('💡 Run "npm run audit-template-assets" to verify completion');
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

async function generateIcon(asset, industry = null) {
  try {
    // Use the template system to get the SVG
    const iconSvg = ICON_SVG_TEMPLATES[asset.template] || createSimpleSvgIcon(asset.name);

    // Determine output path
    let outputPath;
    if (industry) {
      // Industry-specific icon
      const assetsPath = path.join(PROJECT_ROOT, industry, 'assets', 'images');
      await fs.ensureDir(assetsPath);
      outputPath = path.join(assetsPath, asset.name);
    } else {
      // Universal contact icon - place in each industry
      const industries = await getIndustryFolders();
      for (const ind of industries) {
        const assetsPath = path.join(PROJECT_ROOT, ind, 'assets', 'images');
        await fs.ensureDir(assetsPath);
        const industryPath = path.join(assetsPath, asset.name);
        await fs.writeFile(industryPath, iconSvg, 'utf-8');
      }
      return true; // Return true for universal icons
    }

    // Write the icon file
    await fs.writeFile(outputPath, iconSvg, 'utf-8');
    return true;

  } catch (error) {
    console.warn(`   ⚠️  Failed to generate ${asset.name}:`, error.message);
    return false;
  }
}

function createSimpleSvgIcon(name) {
  // Create a simple, recognizable SVG based on the icon name
  const iconType = name.toLowerCase();

  if (iconType.includes('phone')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
  }

  if (iconType.includes('email') || iconType.includes('envelope')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
  }

  if (iconType.includes('location') || iconType.includes('map') || iconType.includes('pin')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  }

  if (iconType.includes('house') || iconType.includes('home')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`;
  }

  if (iconType.includes('building')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><rect x="9" y="6" width="6" height="4"/><rect x="9" y="12" width="6" height="4"/><line x1="9" y1="18" x2="15" y2="18"/></svg>`;
  }

  if (iconType.includes('wrench') || iconType.includes('tool')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
  }

  if (iconType.includes('hammer')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 14.36a4 4 0 0 0-5.66 5.66l-1.48 1.48c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L14.36 17.64"/><path d="M20.91 11.7a6 6 0 0 0-8.49 8.49l-1.48 1.48c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L15.7 20.91"/><path d="M9 12l7-7"/></svg>`;
  }

  if (iconType.includes('hardhat') || iconType.includes('helmet')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6h0"/><path d="M14 6a6 6 0 0 1 6 6v3"/></svg>`;
  }

  if (iconType.includes('camera')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h1.586a1 1 0 0 1 .707.293l.707.707A1 1 0 0 0 13.414 11H15m-6 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>`;
  }

  if (iconType.includes('heart')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
  }

  if (iconType.includes('dumbbell') || iconType.includes('weight')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.4 14.4 9.6 9.6m0 0L3 6l3.6-3.6L9.6 9.6m4.8 4.8L21 18l-3.6 3.6L14.4 14.4z"/><path d="M6 6l12 12"/></svg>`;
  }

  if (iconType.includes('stethoscope')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`;
  }

  if (iconType.includes('hospital')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l10 9H2l10-9z"/><path d="M9 22V12h6v10"/><path d="M2 22h20"/><path d="M7 6h.01"/><path d="M7 2h.01"/></svg>`;
  }

  if (iconType.includes('pill') || iconType.includes('medicine')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5h.01"/><path d="M13.5 3.5h.01"/><path d="M2 12a10 10 0 0 1 20 0"/><path d="M10.5 20.5a10 10 0 0 0 9-9.5"/><path d="M13.5 3.5a10 10 0 0 0-9 9.5"/></svg>`;
  }

  if (iconType.includes('bandage') || iconType.includes('medical')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 12h.01"/><path d="M17 12h.01"/><path d="M11 10h2"/><path d="M11 14h2"/></svg>`;
  }

  if (iconType.includes('scale') || iconType.includes('balance')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 5-5 0-1-.5-1.5-1-2"/><path d="M17 7h2c2 0 5-1 5-5 0-1-.5-1.5-1-2"/><path d="M6 7h12"/></svg>`;
  }

  if (iconType.includes('gavel')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
  }

  if (iconType.includes('document') || iconType.includes('file')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>`;
  }

  // Default generic icon
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`;
}

function createLucideIcon(IconComponent) {
  // For now, return a simple SVG - in a real implementation,
  // we'd render the Lucide React component to SVG
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
}

function createTablerIcon(IconComponent) {
  // Similar to Lucide, simplified for now
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h1.586a1 1 0 0 1 .707.293l.707.707A1 1 0 0 0 13.414 11H15m-6 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>`;
}

function createPhosphorIcon(IconComponent) {
  // Similar to others, simplified for now
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;
}

async function generatePlaceholderImages() {
  const industries = await getIndustryFolders();
  let totalGenerated = 0;

  // Define placeholder images needed
  const placeholders = [
    // Team images
    { name: 'workers-crew-staff_about_1.webp', type: 'team', text: 'Team Photo' },

    // Hero images
    { name: 'roofing-team-professional_hero_1.webp', type: 'hero', text: 'Hero Image' },

    // Avatar images
    { name: 'customer-review-avatar-3_avatar_1.webp', type: 'avatar', text: 'Avatar' },
    { name: 'customer-avatar-profile-1_avatar_2.webp', type: 'avatar', text: 'Avatar' },
    { name: 'client-person-testimonial-2_avatar_3.webp', type: 'avatar', text: 'Avatar' },

    // Work images
    { name: 'photography-services-enterprise.webp', type: 'work', text: 'Work Sample' }
  ];

  for (const industry of industries) {
    const assetsPath = path.join(PROJECT_ROOT, industry, 'assets', 'images');

    for (const placeholder of placeholders) {
      const outputPath = path.join(assetsPath, placeholder.name);

      // Skip if already exists
      if (await fs.pathExists(outputPath)) {
        continue;
      }

      try {
        const settings = PLACEHOLDER_SETTINGS[placeholder.type];
        await createPlaceholderImage(outputPath, settings, placeholder.text);
        totalGenerated++;
        console.log(`   ✅ Generated: ${placeholder.name} (${placeholder.type})`);
      } catch (error) {
        console.warn(`   ⚠️  Failed to generate ${placeholder.name}:`, error.message);
      }
    }
  }

  return totalGenerated;
}

async function createPlaceholderImage(outputPath, settings, text) {
  const svg = `
    <svg width="${settings.width}" height="${settings.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${settings.bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="${settings.textColor}" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `;

  // Convert SVG to WebP using Sharp
  const buffer = Buffer.from(svg);
  await sharp(buffer)
    .webp({ quality: 90 })
    .toFile(outputPath);
}

// Run the script
generateMissingAssets().catch(error => {
  console.error('❌ Error generating missing assets:', error);
  process.exit(1);
});
