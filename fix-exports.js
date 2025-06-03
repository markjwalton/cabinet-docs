// fix-exports.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all page.tsx files in the app directory
const pageFiles = glob.sync('src/app/**/page.tsx');

pageFiles.forEach(file => {
  console.log(`Processing ${file}...`);
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Check if the file already has a default export
  if (!content.includes('export default')) {
    // Find the component declaration
    const componentMatch = content.match(/(?:function|const)\s+(\w+)(?:\s*:\s*React\.FC(?:<[^>]*>)?)?/);
    
    if (componentMatch) {
      const componentName = componentMatch[1];
      
      // Add default export at the end of the file
      content = content.trim();
      content += `\n\nexport default ${componentName};\n`;
      
      fs.writeFileSync(file, content);
      console.log(`✅ Added default export for ${componentName} in ${file}`);
    } else {
      console.log(`❌ Could not find component name in ${file}`);
    }
  } else {
    console.log(`✓ ${file} already has a default export`);
  }
});

console.log('Export fix complete!');
