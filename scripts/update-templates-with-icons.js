#!/usr/bin/env node

/**
 * Update Templates with Professional Icons
 * Replaces emoji icons in templates with professional SVG icons from the asset system
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Industry-specific icon mappings - comprehensive emoji to SVG mapping
const ICON_MAPPINGS = {
  fitness: {
    '💪': 'fitness-icon-dumbbell.svg',
    '🏋️': 'fitness-icon-weight.svg',
    '🏋️‍♂️': 'fitness-icon-weight.svg',
    '🏋️‍♀️': 'fitness-icon-dumbbell.svg',
    '🧘': 'fitness-icon-yoga.svg',
    '🧘‍♀️': 'fitness-icon-yoga.svg',
    '🧘‍♂️': 'fitness-icon-yoga.svg',
    '🏃': 'fitness-icon-treadmill.svg',
    '🏃‍♀️': 'fitness-icon-treadmill.svg',
    '🏃‍♂️': 'fitness-icon-treadmill.svg',
    '🏃‍♀️': 'fitness-icon-treadmill.svg',
    '🏃‍♂️': 'fitness-icon-treadmill.svg',
    '💪': 'fitness-icon-dumbbell.svg',
    '🏋️': 'fitness-icon-weight.svg',
    '🏋️‍♀️': 'fitness-icon-dumbbell.svg',
    '🏋️‍♂️': 'fitness-icon-weight.svg'
  },
  healthcare: {
    '🏥': 'healthcare-hospital-medical-2.svg',
    '👨‍⚕️': 'healthcare-hospital-medical-5.svg',
    '👩‍⚕️': 'healthcare-hospital-medical-5.svg',
    '💊': 'healthcare-hospital-medical-15.svg',
    '🩺': 'healthcare-hospital-medical-19.svg',
    '🩹': 'healthcare-hospital-medical-22.svg',
    '🏥': 'healthcare-hospital-medical-2.svg',
    '👨‍⚕️': 'healthcare-hospital-medical-5.svg',
    '💊': 'healthcare-hospital-medical-15.svg',
    '🩺': 'healthcare-hospital-medical-19.svg',
    '🩹': 'healthcare-hospital-medical-22.svg'
  },
  'contractors-trades': {
    '🔨': 'contractors-trades-icon-contractor-icon-toolbox.svg',
    '🏗️': 'contractors-trades-icon-contractors-icon-hardhat.svg',
    '⚡': 'contractors-trades-icon-contractor-icon-electrical.svg',
    '🔧': 'contractors-trades-icon-contractor-icon-toolbox.svg',
    '🛠️': 'contractors-trades-icon-contractor-icon-toolbox.svg',
    '🔨': 'contractors-trades-icon-contractor-icon-toolbox.svg',
    '🏗️': 'contractors-trades-icon-contractors-icon-hardhat.svg',
    '⚡': 'contractors-trades-icon-contractor-icon-electrical.svg',
    '🔧': 'contractors-trades-icon-contractor-icon-toolbox.svg',
    '🛠️': 'contractors-trades-icon-contractor-icon-toolbox.svg'
  },
  restaurants: {
    '🍽️': 'restaurants-utensils-1.svg',
    '🍴': 'restaurants-utensils-1.svg',
    '☕': 'restaurants-coffee-3.svg',
    '🍕': 'restaurants-plate-2.svg',
    '🍖': 'restaurants-plate-2.svg',
    '🍽️': 'restaurants-utensils-1.svg',
    '🍴': 'restaurants-utensils-1.svg',
    '☕': 'restaurants-coffee-3.svg',
    '🍕': 'restaurants-plate-2.svg',
    '🍖': 'restaurants-plate-2.svg'
  },
  photography: {
    '📸': 'photography-camera-1.svg',
    '📷': 'photography-camera-1.svg',
    '🔍': 'photography-lens-2.svg',
    '📹': 'photography-camera-1.svg',
    '📸': 'photography-camera-1.svg',
    '📷': 'photography-camera-1.svg',
    '🔍': 'photography-lens-2.svg',
    '📹': 'photography-camera-1.svg'
  },
  roofing: {
    '🏠': 'roofing-house-1.svg',
    '🏘️': 'roofing-house-1.svg',
    '🔨': 'roofing-house-1.svg',
    '🏠': 'roofing-house-1.svg',
    '🏘️': 'roofing-house-1.svg',
    '🔨': 'roofing-house-1.svg'
  },
  'retail-ecommerce': {
    '🛒': 'ecommerce-cart-1.svg',
    '🛍️': 'ecommerce-cart-1.svg',
    '💳': 'ecommerce-cart-1.svg',
    '🛒': 'ecommerce-cart-1.svg',
    '🛍️': 'ecommerce-cart-1.svg',
    '💳': 'ecommerce-cart-1.svg'
  },
  legal: {
    '⚖️': 'legal-icon-scales.svg',
    '👨‍⚖️': 'legal-icon-gavel.svg',
    '📋': 'legal-icon-document.svg',
    '🏛️': 'legal-icon-building.svg'
  },
  'real-estate': {
    '🏠': 'real-estate-icon-house.svg',
    '🏘️': 'real-estate-icon-house.svg',
    '🏢': 'real-estate-icon-building.svg',
    '🏠': 'real-estate-icon-house.svg',
    '🏘️': 'real-estate-icon-house.svg',
    '🏢': 'real-estate-icon-building.svg'
  }
};

// Contact section icon mappings (universal across all industries)
const CONTACT_ICON_MAPPINGS = {
  '📞': 'contact-icon-phone.svg',
  '📧': 'contact-icon-email.svg',
  '📍': 'contact-icon-location.svg',
  '📱': 'contact-icon-phone.svg',
  '✉️': 'contact-icon-email.svg',
  '📬': 'contact-icon-email.svg',
  '🏠': 'contact-icon-location.svg',
  '📍': 'contact-icon-location.svg'
};

// Hero image mappings
const HERO_IMAGES = {
  fitness: 'fitness-hero-strength-training.webp',
  healthcare: 'healthcare-hero-medical-team.webp',
  'contractors-trades': 'contractors-trades--projects-swinginghammer.webp',
  restaurants: 'restaurants-plate-2.svg', // Use SVG as hero for restaurants
  photography: 'photography-hero-road.webp',
  roofing: 'roofing-hero-professional-crew.webp',
  'retail-ecommerce': 'ecommerce-cart-1.svg'
};

async function updateTemplatesWithIcons() {
  console.log('🎨 Starting Template Icon Update Process...\n');

  // Get all industry folders
  const industries = await getIndustryFolders();

  let totalTemplatesUpdated = 0;
  let totalIconsReplaced = 0;

  for (const industry of industries) {
    console.log(`📁 Processing ${industry} templates...`);

    const templatesUpdated = await updateIndustryTemplates(industry);
    totalTemplatesUpdated += templatesUpdated.count;
    totalIconsReplaced += templatesUpdated.iconsReplaced;

    console.log(`   ✅ Updated ${templatesUpdated.count} templates, replaced ${templatesUpdated.iconsReplaced} icons\n`);
  }

  console.log('🎉 Template icon update complete!');
  console.log(`📊 Summary:`);
  console.log(`   🗂️  Templates updated: ${totalTemplatesUpdated}`);
  console.log(`   🎯 Icons replaced: ${totalIconsReplaced}`);
  console.log(`   🚀 Templates now rich with professional assets!`);
}

async function getIndustryFolders() {
  const items = await fs.readdir(PROJECT_ROOT);
  const industries = [];

  for (const item of items) {
    const fullPath = path.join(PROJECT_ROOT, item);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory() &&
        !item.startsWith('.') &&
        !['node_modules', 'dist', 'build', 'scripts', 'src', 'public', '_raw_assets'].includes(item)) {

      // Check if it has template subfolders
      const subfolders = await fs.readdir(fullPath);
      const hasTemplates = subfolders.some(sub =>
        ['minimal-creative', 'business-professional', 'professional-enterprise'].includes(sub)
      );

      if (hasTemplates) {
        industries.push(item);
      }
    }
  }

  return industries;
}

async function updateIndustryTemplates(industry) {
  const industryPath = path.join(PROJECT_ROOT, industry);
  const templateFolders = ['minimal-creative', 'business-professional', 'professional-enterprise'];

  let templatesUpdated = 0;
  let totalIconsReplaced = 0;

  for (const templateFolder of templateFolders) {
    const templatePath = path.join(industryPath, templateFolder);
    const indexPath = path.join(templatePath, 'index.html');

    if (!await fs.pathExists(indexPath)) {
      continue;
    }

    console.log(`   📄 Updating ${industry}/${templateFolder}...`);

    // Read the HTML file
    let htmlContent = await fs.readFile(indexPath, 'utf-8');

    // Clean up any existing issues first
    htmlContent = cleanupExistingIssues(htmlContent);

    // Replace emoji icons with professional Icon components
    const iconMappings = ICON_MAPPINGS[industry] || {};
    let iconsReplaced = 0;

    for (const [emoji, iconFile] of Object.entries(iconMappings)) {
      const regex = new RegExp(escapeRegExp(emoji), 'g');

      // Replace emoji with professional Icon component
      const replacement = `<icon-element name="${iconFile.replace(/\.(svg|png|webp)$/i, '')}" size="48" class="service-icon-img" aria-label="${getAltText(iconFile)}"></icon-element>`;
      const matches = (htmlContent.match(regex) || []).length;

      if (matches > 0) {
        htmlContent = htmlContent.replace(regex, replacement);
        iconsReplaced += matches;
        console.log(`      🎯 Replaced ${matches} × ${emoji} → ${iconFile} (Icon Component)`);
      }
    }

    // Replace contact section icons (universal across all industries)
    for (const [emoji, iconFile] of Object.entries(CONTACT_ICON_MAPPINGS)) {
      const regex = new RegExp(escapeRegExp(emoji), 'g');

      // Replace emoji with professional Icon component
      const replacement = `<icon-element name="${iconFile.replace(/\.(svg|png|webp)$/i, '')}" size="24" class="contact-icon-img" aria-label="${getAltText(iconFile)}"></icon-element>`;
      const matches = (htmlContent.match(regex) || []).length;

      if (matches > 0) {
        htmlContent = htmlContent.replace(regex, replacement);
        iconsReplaced += matches;
        console.log(`      📞 Replaced ${matches} × ${emoji} → ${iconFile} (Icon Component)`);
      }
    }

    // Fix any remaining incorrect asset paths
    htmlContent = fixAssetPaths(htmlContent);

    // Add hero image if available
    const heroImage = HERO_IMAGES[industry];
    if (heroImage) {
      htmlContent = addHeroImage(htmlContent, heroImage, industry);
      console.log(`      🖼️  Added hero image: ${heroImage}`);
    }

    // Add gallery images (only if not already present)
    if (!htmlContent.includes('<section id="gallery" class="gallery">')) {
      htmlContent = addGalleryImages(htmlContent, industry);
      console.log(`      🎨 Added gallery images for ${industry}`);
    }

    // Write back the updated HTML
    await fs.writeFile(indexPath, htmlContent, 'utf-8');

    templatesUpdated++;
    totalIconsReplaced += iconsReplaced;
  }

  return { count: templatesUpdated, iconsReplaced: totalIconsReplaced };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getAltText(iconFile) {
  // Generate meaningful alt text from icon filename
  const name = iconFile.replace(/\.(svg|png|jpg|jpeg|webp)$/i, '');
  return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function addHeroImage(htmlContent, heroImage, industry) {
  const heroImagePath = `../assets/images/${heroImage}`;

  // Look for hero section and add background image
  const heroRegex = /<section[^>]*class="[^"]*hero[^"]*"[^>]*>(.*?)<\/section>/s;
  const match = htmlContent.match(heroRegex);

  if (match) {
    let heroSection = match[1];

    // Add background image style
    const styleAttr = ` style="background-image: url('${heroImagePath}'); background-size: cover; background-position: center;"`;

    // Replace the opening tag
    heroSection = heroSection.replace(
      /(<div[^>]*class="[^"]*hero[^"]*"[^>]*>)/,
      `$1${styleAttr}`
    );

    // Replace back in the HTML
    htmlContent = htmlContent.replace(heroRegex, `<section class="hero hero-with-image">${heroSection}</section>`);
  }

  return htmlContent;
}

function addGalleryImages(htmlContent, industry) {
  // Add a gallery section before the contact section
  const galleryHtml = generateGalleryHTML(industry);

  if (galleryHtml) {
    // Insert before contact section
    const contactRegex = /(<section[^>]*class="[^"]*contact[^"]*"[^>]*>)/;
    if (contactRegex.test(htmlContent)) {
      htmlContent = htmlContent.replace(contactRegex, `${galleryHtml}$1`);
    } else {
      // Append at the end of main content
      htmlContent = htmlContent.replace('</main>', `${galleryHtml}</main>`);
    }
  }

  return htmlContent;
}

function generateGalleryHTML(industry) {
  // Generate gallery HTML based on available images
  const galleryImages = getGalleryImagesForIndustry(industry);

  if (galleryImages.length === 0) {
    return '';
  }

  let galleryHtml = `
        <section id="gallery" class="gallery">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Our Work</h2>
                    <p class="section-subtitle">See our professional results</p>
                </div>
                <div class="gallery-grid">
`;

  galleryImages.forEach(image => {
    const altText = getAltText(image);
    galleryHtml += `                    <div class="gallery-item">
                        <img src="../assets/images/${image}" alt="${altText}" loading="lazy">
                    </div>
`;
  });

  galleryHtml += `                </div>
            </div>
        </section>
`;

  return galleryHtml;
}

function getGalleryImagesForIndustry(industry) {
  // Return appropriate gallery images for each industry
  const galleryMappings = {
    fitness: [
      'fitness-classes-pilates.webp',
      'fitness-equipment-cable-machine.webp',
      'fitness-trainers-certified-crossfit.webp',
      'fitness-hero-group-class.webp'
    ],
    healthcare: [
      'healthcare-hero-medical-equipment.webp',
      'healthcare-team-cardiology.webp',
      'healthcare-services-primary-care.webp',
      'healthcare-facilities-x-ray.webp'
    ],
    'contractors-trades': [
      'contractors-trades--hvac-airconditioning.webp',
      'contractors-trades--projects-swinginghammer.webp',
      'contractors-trades-icon-contractor-icon-blueprint.webp',
      'contractors-trades-icon-contractors-icon-hardhat.webp'
    ],
    photography: [
      'photography-hero-seamless.webp',
      'photography-ideas-trippy.webp',
      'photography-services-enterprise.webp'
    ],
    roofing: [
      'roofing-crew-residential.webp',
      'roofing-gallery-before-after.webp',
      'roofing-team-members-photoshoot.webp'
    ]
  };

  return galleryMappings[industry] || [];
}

function cleanupExistingIssues(htmlContent) {
  // Remove duplicate gallery sections
  const galleryRegex = /<section id="gallery" class="gallery">[\s\S]*?<\/section>/g;
  const matches = htmlContent.match(galleryRegex);
  if (matches && matches.length > 1) {
    // Keep only the last gallery section
    htmlContent = htmlContent.replace(galleryRegex, '');
    htmlContent = htmlContent.replace('</main>', `${matches[matches.length - 1]}</main>`);
  }

  // Fix malformed hero sections - comprehensive hero HTML repair
  // Fix cases where style attribute is outside the opening tag
  htmlContent = htmlContent.replace(
    /(<div class="hero-container"[^>]*)>\s*style="([^"]*)"[^>]*>/g,
    '$1 style="$2">'
  );

  // Fix missing opening h2 tags in hero sections
  htmlContent = htmlContent.replace(
    /(<div class="hero-content"[^>]*>)\s*([A-Z][^<]*)/g,
    '$1\n                    <h2 class="hero-title">\n                        $2'
  );

  // Fix hero accent spans that are missing proper structure
  htmlContent = htmlContent.replace(
    /([A-Z][^<]*)\s*<span class="hero-accent">([^<]*)<\/span>\s*<\/h2>/g,
    '$1\n                        <span class="hero-accent">$2</span>\n                    </h2>'
  );

  // Fix cases where hero content is missing proper div structure
  if (htmlContent.includes('<div class="hero-container">') && !htmlContent.includes('<div class="hero-content">')) {
    htmlContent = htmlContent.replace(
      /(<div class="hero-container"[^>]*>)/,
      '$1\n                <div class="hero-content">'
    );

    // Add closing div for hero-content if missing
    htmlContent = htmlContent.replace(
      /(<\/h2>\s*<\/div>\s*<div class="hero-actions")/,
      '                    </h2>\n                </div>\n                <div class="hero-actions"'
    );
  }

  // Remove any remaining malformed style attributes outside tags
  htmlContent = htmlContent.replace(
    / style="[^"]*"[^>]*>/g,
    '>'
  );

  // Fix service card structure - ensure consistent sizing
  htmlContent = htmlContent.replace(
    /<div class="service-card">([\s\S]*?)<\/div>/g,
    (match) => {
      // Ensure each service card has consistent structure
      return match.replace(
        /<div class="service-card">/,
        '<div class="service-card" style="height: auto; display: flex; flex-direction: column;">'
      );
    }
  );

  return htmlContent;
}

function fixAssetPaths(htmlContent) {
  // Fix any remaining incorrect asset paths
  htmlContent = htmlContent.replace(
    /src="assets\/images\/([^"]*)"/g,
    'src="../assets/images/$1"'
  );

  // Fix about images that might be using wrong paths
  htmlContent = htmlContent.replace(
    /src="assets\/([^"]*\.(webp|jpg|jpeg|png|svg))"/g,
    'src="../assets/images/$1"'
  );

  return htmlContent;
}

// Run the script
updateTemplatesWithIcons().catch(error => {
  console.error('❌ Error updating templates:', error);
  process.exit(1);
});
