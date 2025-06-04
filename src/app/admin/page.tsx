'use client';

import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/cards/Card';
import Button from '@/components/ui/buttons/Button';

/**
 * Admin Dashboard Page
 * 
 * This page serves as the main admin dashboard with cards for different admin sections.
 */
export default function AdminPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-[var(--color-text)]">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Application Settings Card */}
        <Card title="Application Settings">
          <div className="p-4">
            <p className="text-[var(--color-text)] mb-4">
              Configure global application settings including themes, branding, and general preferences.
            </p>
            <div className="space-y-2">
              <Link href="/admin/applicationSettings/theme" passHref>
                <Button variant="primary" fullWidth>
                  Theme Settings
                </Button>
              </Link>
              <Link href="/admin/applicationSettings/general" passHref>
                <Button variant="outline" fullWidth>
                  General Settings
                </Button>
              </Link>
            </div>
          </div>
        </Card>
        
        {/* User Management Card */}
        <Card title="User Management">
          <div className="p-4">
            <p className="text-[var(--color-text)] mb-4">
              Manage users, roles, and permissions across the application.
            </p>
            <Link href="/admin/users" passHref>
              <Button variant="primary" fullWidth>
                Manage Users
              </Button>
            </Link>
          </div>
        </Card>
        
        {/* Content Management Card */}
        <Card title="Content Management">
          <div className="p-4">
            <p className="text-[var(--color-text)] mb-4">
              Create, edit, and organize content throughout the application.
            </p>
            <Link href="/admin/content" passHref>
              <Button variant="primary" fullWidth>
                Manage Content
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
