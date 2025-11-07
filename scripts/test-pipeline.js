// scripts/test-pipeline.js
// Simple test to demonstrate filename parsing logic

const testFilenames = [
    'roofing-hero-professional-crew.jpg',
    'fitness-about-gym-equipment.png',
    'contractors-trades-hero-construction-site.jpeg',
    'restaurants-menu-specials.png',
    'legal-hero-courtroom.jpg',
    'healthcare-about-medical-team.webp',
    'photography-portfolio-wedding-shoot.jpg',
    'real-estate-listings-modern-home.webp',
    'retail-ecommerce-hero-fashion-store.jpg',
    'invalid-filename.jpg', // Should fail
    'another-invalid.jpg', // Should fail
];

// Valid industry names (same as in distribute-assets.js)
const validIndustries = [
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

console.log('🧪 Testing Asset Distribution Pipeline Filename Parsing\n');

testFilenames.forEach(filename => {
    // Same logic as in distribute-assets.js
    let industry = null;
    let restOfFilename = filename;

    for (const validIndustry of validIndustries) {
        if (filename.startsWith(validIndustry + '-')) {
            industry = validIndustry;
            restOfFilename = filename.substring(validIndustry.length + 1); // +1 for the hyphen
            break;
        }
    }

    if (!industry) {
        console.log(`❌ ${filename} - Industry not recognized. Valid industries: ${validIndustries.join(', ')}\n`);
        return;
    }

    // Extract extension from remaining filename
    const lastDotIndex = restOfFilename.lastIndexOf('.');
    if (lastDotIndex === -1) {
        console.log(`❌ ${filename} - No file extension found\n`);
        return;
    }

    const restOfName = restOfFilename.substring(0, lastDotIndex);
    const ext = restOfFilename.substring(lastDotIndex + 1).toLowerCase();

    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        console.log(`❌ ${filename} - Invalid extension: ${ext}\n`);
        return;
    }

    const newFilename = `${industry}-${restOfName}.webp`;
    const targetPath = `${industry}/assets/images/${newFilename}`;

    console.log(`✅ ${filename}`);
    console.log(`   → Industry: ${industry}`);
    console.log(`   → Target: ${targetPath}`);
    console.log(`   → Optimized: ${newFilename}\n`);
});

console.log('💡 Remember: Use format [industry]-[section]-[description].[extension]');
console.log('📁 Drop images in _raw_assets/ and run: npm run distribute-assets');
