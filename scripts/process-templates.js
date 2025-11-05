const fs = require('fs');
const path = require('path');
const glob = require('glob');
const Mustache = require('mustache');

// Function to process templates
function processTemplates() {
  console.log('Processing Mustache templates...');

  // Find all HTML template files in pages directories
  const templateFiles = glob.sync('**/*.html', {
    ignore: ['node_modules/**', 'dist/**', '.git/**', 'index.html', 'tools/**']
  }).filter(file => file.includes('/pages/'));

  let processedCount = 0;

  templateFiles.forEach(templateFile => {
    try {
      // Check if this file has already been processed (contains processed content)
      const templateContent = fs.readFileSync(templateFile, 'utf8');

      // Skip if already processed (contains actual data instead of Mustache variables)
      if (!templateContent.includes('{{') && templateContent.includes('<html')) {
        console.log(`Skipping already processed: ${templateFile}`);
        return;
      }

      // Find the corresponding demo-content.json file
      const templateDir = path.dirname(templateFile);
      const parentDir = path.dirname(templateDir); // Go up one level from pages/
      const demoContentPath = path.join(parentDir, 'assets', 'demo-content.json');

      if (fs.existsSync(demoContentPath)) {
        // Read the demo content
        const demoContent = JSON.parse(fs.readFileSync(demoContentPath, 'utf8'));

        // Use the data as-is (Mustache can handle nested structures)
        const templateData = demoContent;

        // Process the template with Mustache
        const processedContent = Mustache.render(templateContent, templateData);

        // Write back to the same file (this will be used by Vite)
        fs.writeFileSync(templateFile, processedContent);

        console.log(`Processed: ${templateFile}`);
        processedCount++;
      } else {
        console.log(`No demo content found for: ${templateFile}`);
      }
    } catch (error) {
      console.error(`Error processing ${templateFile}:`, error.message);
    }
  });

  console.log(`Total templates processed: ${processedCount}`);
}

// Function to flatten nested objects for Mustache
function flattenObject(obj, prefix = '') {
  const flattened = {};

  for (const key in obj) {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}_${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Recursively flatten nested objects
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else if (Array.isArray(obj[key])) {
        // Handle arrays
        flattened[newKey] = obj[key];
      } else {
        // Handle primitive values
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
}

// Run the processing
processTemplates();
