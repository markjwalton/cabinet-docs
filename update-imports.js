/**
 * Script to update relative imports to absolute imports with path aliases
 * 
 * This script will:
 * 1. Find all TypeScript files in your project
 * 2. Identify relative imports (../)
 * 3. Convert them to absolute imports with path aliases (@/)
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Configuration
const SRC_DIR = path.resolve(process.cwd(), 'src');
const FILE_EXTENSIONS = ['.ts', '.tsx'];
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

// Regular expression to match relative imports
const RELATIVE_IMPORT_REGEX = /import\s+(?:(?:{[^}]*})|(?:[\w\d_$]+))\s+from\s+['"](\.\.\/.+?)['"]/g;

// Stats
let totalFiles = 0;
let modifiedFiles = 0;
let totalImportsChanged = 0;

/**
 * Recursively find all TypeScript files in a directory
 */
async function findTsFiles(dir) {
    const files = [];
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Skip node_modules and .next directories
            if (entry.name !== 'node_modules' && entry.name !== '.next') {
                const subFiles = await findTsFiles(fullPath);
                files.push(...subFiles);
            }
        } else if (FILE_EXTENSIONS.includes(path.extname(entry.name))) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Convert a relative import path to an absolute import path with path alias
 */
function convertToAbsoluteImport(filePath, importPath) {
    // Get the directory of the current file
    const fileDir = path.dirname(filePath);

    // Resolve the relative import path to an absolute path
    const absoluteImportPath = path.resolve(fileDir, importPath);

    // Convert to a path relative to the src directory
    const srcRelativePath = path.relative(SRC_DIR, absoluteImportPath);

    // Convert to path alias format
    return `@/${srcRelativePath}`;
}

/**
 * Process a single file to update imports
 */
async function processFile(filePath) {
    try {
        // Read the file content
        const content = await readFile(filePath, 'utf8');
        let newContent = content;
        let importsChanged = 0;

        // Find all relative imports and replace them
        const matches = content.matchAll(RELATIVE_IMPORT_REGEX);

        for (const match of matches) {
            const fullMatch = match[0];
            const importPath = match[1];

            // Skip if it's not a relative import starting with ../
            if (!importPath.startsWith('../')) continue;

            // Convert to absolute import
            const absoluteImport = convertToAbsoluteImport(filePath, importPath);

            // Replace in the content
            const newImport = fullMatch.replace(importPath, absoluteImport);
            newContent = newContent.replace(fullMatch, newImport);

            importsChanged++;
            totalImportsChanged++;

            if (VERBOSE) {
                console.log(`  ${importPath} -> ${absoluteImport}`);
            }
        }

        // Write the updated content back to the file if changes were made
        if (importsChanged > 0) {
            modifiedFiles++;

            if (!DRY_RUN) {
                await writeFile(filePath, newContent, 'utf8');
            }

            const relativePath = path.relative(process.cwd(), filePath);
            console.log(`✅ Updated ${importsChanged} imports in ${relativePath}`);
        }

        return importsChanged;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return 0;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('🔍 Finding TypeScript files...');
    const files = await findTsFiles(SRC_DIR);
    totalFiles = files.length;

    console.log(`📝 Processing ${totalFiles} files${DRY_RUN ? ' (DRY RUN)' : ''}...`);

    for (const file of files) {
        await processFile(file);
    }

    console.log('\n📊 Summary:');
    console.log(`Total files scanned: ${totalFiles}`);
    console.log(`Files modified: ${modifiedFiles}`);
    console.log(`Total imports changed: ${totalImportsChanged}`);

    if (DRY_RUN) {
        console.log('\n⚠️ This was a dry run. No files were actually modified.');
        console.log('Run without --dry-run to apply changes.');
    }
}

// Run the script
main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
