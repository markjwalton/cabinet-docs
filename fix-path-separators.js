/**
 * Script to fix Windows-style backslashes in import paths
 * 
 * This script will:
 * 1. Find all TypeScript files in your project
 * 2. Identify import statements with backslashes
 * 3. Replace backslashes with forward slashes
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

// Regular expression to match imports with backslashes
const BACKSLASH_IMPORT_REGEX = /import\s+(?:(?:{[^}]*})|(?:[\w\d_$]+))\s+from\s+['"](@\/[^'"]*?\\[^'"]*?)['"]/g;

// Stats
let totalFiles = 0;
let modifiedFiles = 0;
let totalImportsFixed = 0;

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
 * Fix backslashes in import paths
 */
function fixPathSeparators(importPath) {
    return importPath.replace(/\\/g, '/');
}

/**
 * Process a single file to fix import paths
 */
async function processFile(filePath) {
    try {
        // Read the file content
        const content = await readFile(filePath, 'utf8');
        let newContent = content;
        let importsFixed = 0;

        // Find all imports with backslashes and replace them
        const matches = content.matchAll(BACKSLASH_IMPORT_REGEX);

        for (const match of matches) {
            const fullMatch = match[0];
            const importPath = match[1];

            // Fix path separators
            const fixedImport = fixPathSeparators(importPath);

            // Replace in the content
            const newImport = fullMatch.replace(importPath, fixedImport);
            newContent = newContent.replace(fullMatch, newImport);

            importsFixed++;
            totalImportsFixed++;

            if (VERBOSE) {
                console.log(`  ${importPath} -> ${fixedImport}`);
            }
        }

        // Write the updated content back to the file if changes were made
        if (importsFixed > 0) {
            modifiedFiles++;

            if (!DRY_RUN) {
                await writeFile(filePath, newContent, 'utf8');
            }

            const relativePath = path.relative(process.cwd(), filePath);
            console.log(`✅ Fixed ${importsFixed} imports in ${relativePath}`);
        }

        return importsFixed;
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
    console.log(`Total imports fixed: ${totalImportsFixed}`);

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
