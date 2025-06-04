import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import Button from '../components/ui/buttons/Button';
import Card from '../components/ui/cards/Card';
import Input from '../components/ui/forms/Input';
import Checkbox from '../components/ui/forms/Checkbox';

/**
 * # Theme Preview
 * 
 * This story demonstrates how components would look with different theme settings.
 * It serves as a bridge between Storybook documentation and an admin theming interface.
 * 
 * In a real implementation, these theme variables would be stored in a database or configuration file
 * and loaded dynamically. The admin interface would allow updating these variables.
 */

interface ThemePreviewProps {
  primaryColor: string;
  secondaryColor: string;
  dangerColor: string;
  successColor: string;
  warningColor: string;
  textColor: string;
  backgroundColor: string;
  borderRadius: string;
  fontFamily: string;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({
  primaryColor,
  secondaryColor,
  dangerColor,
  successColor,
  warningColor,
  textColor,
  backgroundColor,
  borderRadius,
  fontFamily,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  
  // Apply theme variables to a style object
  const themeStyle = {
    '--primary-color': primaryColor,
    '--secondary-color': secondaryColor,
    '--danger-color': dangerColor,
    '--success-color': successColor,
    '--warning-color': warningColor,
    '--text-color': textColor,
    '--background-color': backgroundColor,
    '--border-radius': borderRadius,
    '--font-family': fontFamily,
    fontFamily: fontFamily,
    color: textColor,
    backgroundColor: backgroundColor,
    padding: '2rem',
    borderRadius: borderRadius,
  } as React.CSSProperties;
  
  // Custom button styles that use theme variables
  const primaryButtonStyle = {
    backgroundColor: primaryColor,
    color: '#ffffff',
    borderRadius: borderRadius,
  };
  
  const secondaryButtonStyle = {
    backgroundColor: secondaryColor,
    color: '#ffffff',
    borderRadius: borderRadius,
  };
  
  const dangerButtonStyle = {
    backgroundColor: dangerColor,
    color: '#ffffff',
    borderRadius: borderRadius,
  };
  
  const successButtonStyle = {
    backgroundColor: successColor,
    color: '#ffffff',
    borderRadius: borderRadius,
  };
  
  const warningButtonStyle = {
    backgroundColor: warningColor,
    color: '#ffffff',
    borderRadius: borderRadius,
  };
  
  // Custom card style
  const cardStyle = {
    borderRadius: borderRadius,
    backgroundColor: '#ffffff',
    border: `1px solid ${secondaryColor}`,
  };
  
  // Custom input style
  const inputStyle = {
    borderRadius: borderRadius,
    borderColor: secondaryColor,
  };
  
  return (
    <div style={themeStyle}>
      <h1 style={{ fontFamily: fontFamily, color: textColor, marginBottom: '1.5rem' }}>
        Theme Preview
      </h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: fontFamily, color: textColor, marginBottom: '1rem' }}>
          Buttons
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button className="custom-primary" style={primaryButtonStyle}>
            Primary Button
          </Button>
          <Button className="custom-secondary" style={secondaryButtonStyle}>
            Secondary Button
          </Button>
          <Button className="custom-danger" style={dangerButtonStyle}>
            Danger Button
          </Button>
          <Button className="custom-success" style={successButtonStyle}>
            Success Button
          </Button>
          <Button className="custom-warning" style={warningButtonStyle}>
            Warning Button
          </Button>
        </div>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: fontFamily, color: textColor, marginBottom: '1rem' }}>
          Cards
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Card title="Card Title" style={cardStyle}>
            <div style={{ padding: '1rem' }}>
              <p style={{ color: textColor, fontFamily: fontFamily }}>
                This is a card with themed styling. The border radius and colors
                are controlled by theme variables.
              </p>
              <div style={{ marginTop: '1rem' }}>
                <Button className="custom-primary" style={primaryButtonStyle}>
                  Card Action
                </Button>
              </div>
            </div>
          </Card>
          
          <Card title="Another Card" style={cardStyle}>
            <div style={{ padding: '1rem' }}>
              <p style={{ color: textColor, fontFamily: fontFamily }}>
                Cards can contain various elements including text, buttons, and form controls.
              </p>
              <div style={{ marginTop: '1rem' }}>
                <Button className="custom-secondary" style={secondaryButtonStyle}>
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: fontFamily, color: textColor, marginBottom: '1rem' }}>
          Form Controls
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', maxWidth: '400px' }}>
          <Input
            id="themed-input"
            label="Themed Input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter some text"
            style={inputStyle}
          />
          
          <Checkbox
            id="themed-checkbox"
            label="Themed Checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          
          <div style={{ marginTop: '1rem' }}>
            <Button className="custom-primary" style={primaryButtonStyle}>
              Submit Form
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <h2 style={{ fontFamily: fontFamily, color: textColor, marginBottom: '1rem' }}>
          Current Theme Variables
        </h2>
        <pre style={{ 
          backgroundColor: 'rgba(0,0,0,0.05)', 
          padding: '1rem', 
          borderRadius: borderRadius,
          color: textColor,
          fontFamily: 'monospace'
        }}>
{`{
  primaryColor: "${primaryColor}",
  secondaryColor: "${secondaryColor}",
  dangerColor: "${dangerColor}",
  successColor: "${successColor}",
  warningColor: "${warningColor}",
  textColor: "${textColor}",
  backgroundColor: "${backgroundColor}",
  borderRadius: "${borderRadius}",
  fontFamily: "${fontFamily}"
}`}
        </pre>
      </div>
    </div>
  );
};

const meta: Meta<typeof ThemePreview> = {
  title: 'Theme/ThemePreview',
  component: ThemePreview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A preview of how components would look with different theme settings.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    primaryColor: {
      control: 'color',
      description: 'Primary brand color used for main actions and emphasis',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '#3b82f6' },
      },
    },
    secondaryColor: {
      control: 'color',
      description: 'Secondary color used for less prominent elements',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '#64748b' },
      },
    },
    dangerColor: {
      control: 'color',
      description: 'Color used for destructive actions and errors',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '#ef4444' },
      },
    },
    successColor: {
      control: 'color',
      description: 'Color used for success states and confirmations',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '#22c55e' },
      },
    },
    warningColor: {
      control: 'color',
      description: 'Color used for warnings and cautionary actions',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '#f59e0b' },
      },
    },
    textColor: {
      control: 'color',
      description: 'Main text color',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '#1f2937' },
      },
    },
    backgroundColor: {
      control: 'color',
      description: 'Background color for the application',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '#f9fafb' },
      },
    },
    borderRadius: {
      control: 'select',
      options: ['0', '0.125rem', '0.25rem', '0.375rem', '0.5rem', '0.75rem', '1rem', '9999px'],
      description: 'Border radius for UI elements',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '0.375rem' },
      },
    },
    fontFamily: {
      control: 'select',
      options: [
        'system-ui, -apple-system, sans-serif',
        'Arial, sans-serif',
        'Helvetica, sans-serif',
        'Georgia, serif',
        'Verdana, sans-serif',
        'Tahoma, sans-serif',
        'Trebuchet MS, sans-serif',
        'Times New Roman, serif',
        'Courier New, monospace',
      ],
      description: 'Font family for text elements',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'system-ui, -apple-system, sans-serif' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemePreview>;

/**
 * Default theme with blue primary color.
 */
export const DefaultTheme: Story = {
  args: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    dangerColor: '#ef4444',
    successColor: '#22c55e',
    warningColor: '#f59e0b',
    textColor: '#1f2937',
    backgroundColor: '#f9fafb',
    borderRadius: '0.375rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
};

/**
 * Dark theme with purple accent.
 */
export const DarkTheme: Story = {
  args: {
    primaryColor: '#8b5cf6',
    secondaryColor: '#6b7280',
    dangerColor: '#f87171',
    successColor: '#4ade80',
    warningColor: '#fbbf24',
    textColor: '#f9fafb',
    backgroundColor: '#1f2937',
    borderRadius: '0.375rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
};

/**
 * Green theme with rounded corners.
 */
export const GreenTheme: Story = {
  args: {
    primaryColor: '#10b981',
    secondaryColor: '#64748b',
    dangerColor: '#ef4444',
    successColor: '#059669',
    warningColor: '#f59e0b',
    textColor: '#1f2937',
    backgroundColor: '#ecfdf5',
    borderRadius: '0.75rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
};

/**
 * Corporate theme with square corners.
 */
export const CorporateTheme: Story = {
  args: {
    primaryColor: '#0ea5e9',
    secondaryColor: '#475569',
    dangerColor: '#dc2626',
    successColor: '#16a34a',
    warningColor: '#d97706',
    textColor: '#334155',
    backgroundColor: '#f8fafc',
    borderRadius: '0.125rem',
    fontFamily: 'Arial, sans-serif',
  },
};

/**
 * Playful theme with rounded elements.
 */
export const PlayfulTheme: Story = {
  args: {
    primaryColor: '#ec4899',
    secondaryColor: '#8b5cf6',
    dangerColor: '#ef4444',
    successColor: '#22c55e',
    warningColor: '#f59e0b',
    textColor: '#4b5563',
    backgroundColor: '#fdf2f8',
    borderRadius: '1rem',
    fontFamily: 'Trebuchet MS, sans-serif',
  },
};
