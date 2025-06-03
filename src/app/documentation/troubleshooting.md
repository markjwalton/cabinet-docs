# Common Issues & Troubleshooting Guide

This document provides solutions for common issues you might encounter when working with the Wall Mounted Cabinet Management Tool.

## Table of Contents
1. [Dependency Conflicts](#dependency-conflicts)
2. [TypeScript Errors](#typescript-errors)
3. [Build Errors](#build-errors)
4. [Supabase Integration Issues](#supabase-integration-issues)
5. [Document Upload Problems](#document-upload-problems)
6. [UI Rendering Issues](#ui-rendering-issues)

## Dependency Conflicts

### Problem: Version conflicts between packages
```
Error: Conflicting peer dependency: react@18.2.0
```

**Solution:**
```bash
npm install --legacy-peer-deps
```
or
```bash
npm install --force
```

### Problem: Incompatible dependencies
**Solution:** Check package.json for conflicting versions and update to compatible versions:
```json
"dependencies": {
  "@headlessui/react": "^1.7.17",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

## TypeScript Errors

### Problem: Type mismatches with Supabase
```
Type 'Database["public"]["Tables"]["documents"]["Row"]' is not assignable to type 'Document'.
```

**Solution:** Update your type definitions to match the Supabase schema:
```typescript
// Add proper type definitions
export interface Document extends Database["public"]["Tables"]["documents"]["Row"] {
  url?: string;
}
```

### Problem: Missing type definitions
```
Could not find a declaration file for module 'module-name'
```

**Solution:** Install type definitions:
```bash
npm install --save-dev @types/module-name
```

### Problem: Strict null checks failing
**Solution:** Use proper null checking:
```typescript
// Instead of this:
const name = user.name;

// Do this:
const name = user?.name || 'Default Name';
```

## Build Errors

### Problem: Next.js build failing
```
Error: Failed to compile
```

**Solution:**
1. Check for syntax errors in your code
2. Verify all imports are correct
3. Run development server to see detailed errors:
```bash
npm run dev
```

### Problem: Module not found errors
```
Module not found: Can't resolve 'module-name'
```

**Solution:**
1. Install the missing module:
```bash
npm install module-name
```
2. Check import paths for typos
3. Verify the module is listed in package.json

### Problem: Memory issues during build
```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed
```

**Solution:** Increase Node.js memory limit:
```bash
export NODE_OPTIONS=--max_old_space_size=4096
npm run build
```

## Supabase Integration Issues

### Problem: Authentication errors
```
Error: JWT token is invalid
```

**Solution:**
1. Verify your Supabase URL and anon key in `src/lib/supabase/client.ts`
2. Check if the project is active in the Supabase dashboard
3. Regenerate the API keys if necessary

### Problem: Database query errors
```
Error: relation "documents" does not exist
```

**Solution:**
1. Verify table names in your Supabase dashboard
2. Run the SQL scripts to create missing tables:
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  filename TEXT NOT NULL,
  originalFilename TEXT NOT NULL,
  fileSize INTEGER NOT NULL,
  fileType TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  uploadedBy TEXT,
  uploadedAt TIMESTAMP WITH TIME ZONE NOT NULL,
  lastModifiedAt TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### Problem: Storage access issues
```
Error: Storage bucket "documents" does not exist
```

**Solution:**
1. Create the required storage buckets in Supabase dashboard
2. Set appropriate permissions for the buckets
3. Verify bucket names in your code match those in Supabase

## Document Upload Problems

### Problem: File upload failing
```
Error: Failed to upload document
```

**Solution:**
1. Check file size limits (default is 50MB)
2. Verify storage permissions in Supabase
3. Check network connectivity
4. Verify file format is supported

### Problem: File preview not working
**Solution:**
1. Check if the file URL is correctly generated
2. Verify CORS settings in Supabase storage
3. For PDF previews, ensure the PDF viewer is properly configured

## UI Rendering Issues

### Problem: Components not rendering correctly
**Solution:**
1. Check browser console for errors
2. Verify all required CSS is loaded
3. Test in different browsers
4. Clear browser cache

### Problem: Responsive design issues
**Solution:**
1. Use browser developer tools to test different screen sizes
2. Verify Tailwind CSS breakpoints are used correctly:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Problem: Form validation errors
**Solution:**
1. Check form validation logic
2. Verify error messages are displayed correctly
3. Test with different input values

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

If you encounter issues not covered in this guide, please contact the development team for assistance.
