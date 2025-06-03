"use client";

/**
 * Root Layout Component with AppInitializer
 * 
 * This component wraps the entire application with the AppInitializer
 * to ensure database migrations and form schemas are set up.
 * It also includes the NavigationProvider and Navbar for site-wide navigation.
 */

import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { DataProvider } from '@/contexts/DataContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import Navbar from '@/components/ui/layout/Navbar';
import AppInitializer from '@/components/app/AppInitializer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationProvider>
          <DataProvider>
            <NavigationProvider>
              <AppInitializer>
                <Navbar />
                <div className="pt-16">
                  {children}
                </div>
              </AppInitializer>
            </NavigationProvider>
          </DataProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
