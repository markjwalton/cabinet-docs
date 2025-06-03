/**
 * Troubleshooting Documentation Page Component
 * 
 * A component for displaying the troubleshooting guide.
 * Provides solutions for common issues encountered in the project.
 */

import React from 'react';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import Card from '@/components/ui/cards/Card';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Function to get the troubleshooting content
async function getTroubleshootingContent() {
  const filePath = path.join(process.cwd(), 'src/app/documentation/troubleshooting.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Convert markdown to HTML
  const processedContent = await remark()
    .use(html)
    .process(fileContent);
  
  return processedContent.toString();
}

/**
 * Troubleshooting documentation page component
 */
const TroubleshootingPage = async () => {
  const contentHtml = await getTroubleshootingContent();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Documentation', href: '/documentation' },
          { label: 'Troubleshooting', href: '/documentation/troubleshooting' },
        ]}
        showHomeIcon
        className="mb-6"
      />
      
      <h1 className="text-3xl font-bold mb-8">Troubleshooting Guide</h1>
      
      <Card>
        <div 
          className="prose prose-blue max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </Card>
    </div>
  );
};

export default TroubleshootingPage;
