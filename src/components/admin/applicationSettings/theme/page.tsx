'use client';

import ThemeSelector from '@/components/admin/applicationSettings/ThemeSelector';
import Button from '@/components/ui/buttons/Button';
import Link from 'next/link';

/**
 * Theme Settings Page
 * 
 * This page allows administrators to customize the application's theme.
 */
export default function ThemeSettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-8">
        <Link href="/admin" passHref>
          <Button variant="outline" className="mr-4">
            ← Back to Admin
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Theme Settings</h1>
      </div>
      
      <div className="bg-white rounded-[var(--border-radius)] shadow-md">
        <ThemeSelector />
      </div>
    </div>
  );
}
