#!/usr/bin/env node

/**
 * Update Templates with Standardized Images
 * Updates all image references to use properly sized optimized versions
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Image path mappings for standardized versions
const IMAGE_PATH_MAPPINGS = {
  // Hero images - full-width backgrounds
  'fitness-hero-strength-training.jpg': 'fitness-hero-strength-training_hero.webp',
  'fitness-hero-strength-training.jpeg': 'fitness-hero-strength-training_hero.webp',
  'fitness-hero-group-class.jpg': 'fitness-hero-group-class_hero.webp',
  'fitness-hero-gym-interior.jpg': 'fitness-hero-gym-interior_hero.webp',
  'fitness-hero.jpg': 'fitness-hero_hero.webp',
  'fitness-hero1.jpg': 'fitness-hero1_hero.webp',

  // Healthcare hero images
  'healthcare-hero-medical-team.jpg': 'healthcare-hero-medical-team_hero.webp',
  'healthcare-hero-medical-equipment.jpg': 'healthcare-hero-medical-equipment_hero.webp',
  'healthcare-hero-patient-care.jpg': 'healthcare-hero-patient-care_hero.webp',
  'healthcare-hero-team-scrubs.jpg': 'healthcare-hero-team-scrubs_hero.webp',
  'healthcare-hero-waiting-room.jpg': 'healthcare-hero-waiting-room_hero.webp',

  // Contractors hero images
  'contractors-trades--projects-swinginghammer.jpg': 'contractors-trades--projects-swinginghammer_hero.webp',

  // Photography hero images
  'photography-hero-road.jpg': 'photography-hero-road_hero.webp',
  'photography-hero-seamless.jpg': 'photography-hero-seamless_hero.webp',

  // Roofing hero images
  'roofing-hero-professional-crew.jpg': 'roofing-hero-professional-crew_hero.webp',
  'roofing-logo-homehero.jpg': 'roofing-logo-homehero_hero.webp',

  // Team/About images
  'fitness-team-generic-1.jpg': 'fitness-team-generic-1_team.webp',
  'fitness-team-generic-2.jpg': 'fitness-team-generic-2_team.webp',
  'fitness-team-generic-3.jpg': 'fitness-team-generic-3_team.webp',
  'fitness-team-generic-4.jpg': 'fitness-team-generic-4_team.webp',
  'healthcare-team-cardiology.jpg': 'healthcare-team-cardiology_team.webp',
  'healthcare-team-orthopedics.jpg': 'healthcare-team-orthopedics_team.webp',
  'roofing-crew-residential.jpg': 'roofing-crew-residential_team.webp',
  'roofing-about-certified-team.webp': 'roofing-about-certified-team_team.webp',
  'roofing-team-members-photoshoot.jpg': 'roofing-team-members-photoshoot_team.webp',

  // Avatar/Profile images
  'fitness-icon-personontreadmill.jpg': 'fitness-icon-personontreadmill_avatar.webp',

  // Property images
  'real-estate-forsale-home.jpg': 'real-estate-forsale-home_property.webp',
  'real-estate-portfolio-newbuild.jpg': 'real-estate-portfolio-newbuild_property.webp',
  'real-estate-portfolio-outdoorpatio.jpg': 'real-estate-portfolio-outdoorpatio_property.webp',
  'real-estate-portfolio-pool.jpg': 'real-estate-portfolio-pool_property.webp',

  // Work/Project images
  'contractors-trades--projects-swinginghammer.jpg': 'contractors-trades--projects-swinginghammer_work.webp',
  'healthcare-services-cardiology.jpg': 'healthcare-services-cardiology_work.webp',
  'healthcare-services-primary-care.jpg': 'healthcare-services-primary-care_work.webp',
  'roofing-gallery-before-after.jpg': 'roofing-gallery-before-after_work.webp',

  // Gallery images (already optimized)
  'fitness-classes-pilates.jpg': 'fitness-classes-pilates_gallery.webp',
  'fitness-equipment-cable-machine.jpg': 'fitness-equipment-cable-machine_gallery.webp',
  'fitness-trainers-certified-crossfit.jpg': 'fitness-trainers-certified-crossfit_gallery.webp',
  'fitness-hero-group-class.jpg': 'fitness-hero-group-class_gallery.webp',
  'healthcare-hero-medical-equipment.jpg': 'healthcare-hero-medical-equipment_gallery.webp',
  'healthcare-team-cardiology.jpg': 'healthcare-team-cardiology_gallery.webp',
  'healthcare-services-primary-care.jpg': 'healthcare-services-primary-care_gallery.webp',
  'healthcare-facilities-x-ray.jpg': 'healthcare-facilities-x-ray_gallery.webp',
  'photography-hero-seamless.jpg': 'photography-hero-seamless_gallery.webp',
  'photography-ideas-trippy.jpg': 'photography-ideas-trippy_gallery.webp',
  'photography-services-enterprise.jpg': 'photography-services-enterprise_gallery.webp',
  'roofing-crew-residential.jpg': 'roofing-crew-residential_gallery.webp',
  'roofing-gallery-before-after.jpg': 'roofing-gallery-before-after_gallery.webp',
  'roofing-team-members-photoshoot.jpg': 'roofing-team-members-photoshoot_gallery.webp'
};

async function updateTemplatesWithStandardizedImages() {
  console.log('🖼️  Starting Template Image Standardization Update...\n');

  const industries = await getIndustryFolders();
  let totalTemplatesUpdated = 0;
  let totalImagesUpdated = 0;

  for (const industry of industries) {
    console.log(`📁 Processing ${industry} templates...`);

    const result = await updateIndustryTemplates(industry);
    totalTemplatesUpdated += result.templatesUpdated;
    totalImagesUpdated += result.imagesUpdated;

    console.log(`   ✅ Updated ${result.templatesUpdated} templates, ${result.imagesUpdated} image references\n`);
  }

  console.log('🎉 Template image standardization complete!');
  console.log(`📊 Summary:`);
  console.log(`   🗂️  Templates updated: ${totalTemplatesUpdated}`);
  console.log(`   🖼️  Image references updated: ${totalImagesUpdated}`);
  console.log(`   📏 All templates now use standardized image sizes!`);
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

async function updateIndustryTemplates(industry) {
  const industryPath = path.join(PROJECT_ROOT, industry);
  const templateFolders = ['minimal-creative', 'business-professional', 'professional-enterprise'];

  let templatesUpdated = 0;
  let totalImagesUpdated = 0;

  for (const templateFolder of templateFolders) {
    const templatePath = path.join(industryPath, templateFolder);
    const indexPath = path.join(templatePath, 'index.html');

    if (!await fs.pathExists(indexPath)) {
      continue;
    }

    console.log(`   📄 Updating ${industry}/${templateFolder}...`);

    // Read the HTML file
    let htmlContent = await fs.readFile(indexPath, 'utf-8');
    let imagesUpdated = 0;

    // Update image references to use standardized versions
    for (const [oldPath, newPath] of Object.entries(IMAGE_PATH_MAPPINGS)) {
      const oldSrc = `../assets/images/${oldPath}`;
      const newSrc = `../assets/images/${newPath}`;

      // Replace all instances of the old image path
      const regex = new RegExp(escapeRegExp(oldSrc), 'g');
      const matches = (htmlContent.match(regex) || []).length;

      if (matches > 0) {
        htmlContent = htmlContent.replace(regex, newSrc);
        imagesUpdated += matches;
        console.log(`      ✅ ${oldPath} → ${newPath} (${matches} references)`);
      }
    }

    // Write back the updated HTML if any changes were made
    if (imagesUpdated > 0) {
      await fs.writeFile(indexPath, htmlContent, 'utf-8');
      templatesUpdated++;
      totalImagesUpdated += imagesUpdated;
    }
  }

  return { templatesUpdated, imagesUpdated: totalImagesUpdated };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Run the script
updateTemplatesWithStandardizedImages().catch(error => {
  console.error('❌ Error updating templates with standardized images:', error);
  process.exit(1);
});
