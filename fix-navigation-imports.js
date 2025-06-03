// fix-navigation-imports.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript files
const tsFiles = glob.sync('src/**/*.{ts,tsx}');

let fixedFiles = 0;

tsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Check for relative imports of NavigationContext
  const relativeImportRegex = /import\s+\{([^}]*)\}\s+from\s+['"]\.\.+\/contexts\/NavigationContext['"]/;
  
  if (relativeImportRegex.test(content)) {
    // Replace relative imports with alias imports
    content = content.replace(
      relativeImportRegex,
      'import {$1} from \'@/contexts/NavigationContext\''
    );
    
    fs.writeFileSync(file, content);
    console.log(`✅ Fixed NavigationContext import in ${file}`);
    fixedFiles++;
  }
});

console.log(`Fixed imports in ${fixedFiles} files.`);
