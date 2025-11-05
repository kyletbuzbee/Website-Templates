const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Template Validation Script
 * Validates template structure, required files, and data integrity
 */

function validateTemplates() {
  console.log('🔍 Validating templates...');

  const errors = [];
  const warnings = [];

  // Validate industry templates
  const industriesDir = path.join(__dirname, '..', 'industries');
  if (fs.existsSync(industriesDir)) {
    const industries = fs.readdirSync(industriesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    industries.forEach(industry => {
      console.log(`\n📁 Validating industry: ${industry}`);

      const industryPath = path.join(industriesDir, industry);

      // Check for required directories
      const requiredDirs = ['assets', 'docs'];
      requiredDirs.forEach(dir => {
        const dirPath = path.join(industryPath, dir);
        if (!fs.existsSync(dirPath)) {
          errors.push(`Missing required directory: ${dir} in ${industry}`);
        }
      });

      // Check for demo content
      const demoContentPath = path.join(industryPath, 'assets', 'demo-content.json');
      if (fs.existsSync(demoContentPath)) {
        try {
          const demoContent = JSON.parse(fs.readFileSync(demoContentPath, 'utf8'));

          // Validate required fields
          const requiredFields = ['company', 'branding', 'hero'];
          requiredFields.forEach(field => {
            if (!demoContent[field]) {
              errors.push(`Missing required field '${field}' in ${demoContentPath}`);
            }
          });

          // Validate company info
          if (demoContent.company) {
            const companyFields = ['name', 'tagline', 'description'];
            companyFields.forEach(field => {
              if (!demoContent.company[field]) {
                warnings.push(`Missing company field '${field}' in ${demoContentPath}`);
              }
            });
          }

          console.log(`✅ Demo content valid for ${industry}`);
        } catch (e) {
          errors.push(`Invalid JSON in ${demoContentPath}: ${e.message}`);
        }
      } else {
        errors.push(`Missing demo content file: ${demoContentPath}`);
      }

      // Check for documentation
      const docsPath = path.join(industryPath, 'docs');
      if (fs.existsSync(docsPath)) {
        const requiredDocs = ['quick-start.md'];
        requiredDocs.forEach(doc => {
          const docPath = path.join(docsPath, doc);
          if (!fs.existsSync(docPath)) {
            warnings.push(`Missing documentation: ${doc} in ${industry}`);
          }
        });
      }
    });
  }

  // Validate kit templates
  const kitsDir = path.join(__dirname, '..', 'kits');
  if (fs.existsSync(kitsDir)) {
    const kits = fs.readdirSync(kitsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    kits.forEach(kit => {
      console.log(`\n📁 Validating kit: ${kit}`);

      const kitPath = path.join(kitsDir, kit);

      // Check for required directories
      const requiredDirs = ['assets', 'docs'];
      requiredDirs.forEach(dir => {
        const dirPath = path.join(kitPath, dir);
        if (!fs.existsSync(dirPath)) {
          errors.push(`Missing required directory: ${dir} in kit ${kit}`);
        }
      });

      // Check for demo content
      const demoContentPath = path.join(kitPath, 'assets', 'demo-content.json');
      if (fs.existsSync(demoContentPath)) {
        try {
          const demoContent = JSON.parse(fs.readFileSync(demoContentPath, 'utf8'));
          console.log(`✅ Demo content valid for kit ${kit}`);
        } catch (e) {
          errors.push(`Invalid JSON in ${demoContentPath}: ${e.message}`);
        }
      } else {
        errors.push(`Missing demo content file: ${demoContentPath}`);
      }
    });
  }

  // Validate template processing
  console.log('\n🔧 Validating template processing...');

  // Check if templates can be processed
  const templateFiles = glob.sync('**/*.html', {
    ignore: ['node_modules/**', 'dist/**', '.git/**', 'index.html', 'tools/**']
  }).filter(file => file.includes('/pages/'));

  if (templateFiles.length === 0) {
    warnings.push('No template files found in pages directories');
  } else {
    console.log(`✅ Found ${templateFiles.length} template files`);
  }

  // Summary
  console.log('\n📊 Validation Summary:');
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(error => console.log(`  - ${error}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    warnings.forEach(warning => console.log(`  - ${warning}`));
  }

  if (errors.length === 0) {
    console.log('\n✅ Template validation completed successfully!');
    process.exit(0);
  } else {
    console.log('\n❌ Template validation failed!');
    process.exit(1);
  }
}

// Run validation
validateTemplates();
