const fs = require('fs');
const glob = require('glob');

// Find all HTML files
const htmlFiles = glob.sync('**/*.html', {
  ignore: ['node_modules/**', 'dist/**', '.git/**']
});

let fixedCount = 0;

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const originalContent = content;

  // Replace script tags without type="module"
  const updatedContent = content.replace(
    /<script src="\.\.\/assets\/js\/main\.js"><\/script>/g,
    '<script type="module" src="../assets/js/main.js"></script>'
  );

  if (updatedContent !== originalContent) {
    fs.writeFileSync(file, updatedContent);
    console.log('Fixed:', file);
    fixedCount++;
  }
});

console.log('Total files fixed:', fixedCount);
