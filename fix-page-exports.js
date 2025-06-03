// fix-page-exports.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all page.tsx files in the app directory
const pageFiles = glob.sync('src/app/**/page.tsx');

pageFiles.forEach(file => {
  console.log(`Processing ${file}...`);
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Check if the file has React import
  if (!content.includes('import React')) {
    content = `import React from 'react';\n${content}`;
    console.log(`Added React import to ${file}`);
  }
  
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
      // If no component declaration found, create a basic page component
      const pageName = path.basename(path.dirname(file));
      const capitalizedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      
      const newPageContent = `
import React from 'react';

export default function ${capitalizedPageName}Page() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">${capitalizedPageName}</h1>
      <p>Content for ${pageName} page</p>
    </div>
  );
}
`;
      
      fs.writeFileSync(file, newPageContent);
      console.log(`🔄 Created new page component for ${file}`);
    }
  } else {
    console.log(`✓ ${file} already has a default export`);
  }
});

console.log('Export fix complete!');
