import type { Meta, StoryObj } from '@storybook/react';
import Button from '../components/ui/buttons/Button';

/**
 * # Button Component
 * 
 * The Button component is a versatile UI element used for triggering actions throughout the application.
 * It supports different variants, sizes, and states to accommodate various design requirements.
 * 
 * ## Usage
 * 
 * ```tsx
 * import { Button } from '../components/ui/Button';
 * 
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>Submit</Button>
 * 
 * // Secondary button
 * <Button variant="secondary" onClick={handleClick}>Cancel</Button>
 * 
 * // Disabled button
 * <Button variant="primary" disabled>Cannot Submit</Button>
 * ```
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
      description: 'The visual style of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'The size of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when the button is clicked',
      table: {
        type: { summary: 'function' },
      },
    },
    children: {
      control: 'text',
      description: 'The content to display inside the button',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * The default button with primary styling.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
    size: 'medium',
  },
};

/**
 * Secondary button with less visual emphasis, typically used for secondary actions.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
    size: 'medium',
  },
};

/**
 * Danger button used for destructive actions that require user attention.
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
    size: 'medium',
  },
};

/**
 * Small-sized button for compact UI areas.
 */
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
  },
};

/**
 * Large-sized button for emphasizing important actions.
 */
export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
};

/**
 * Disabled button state when the action is not available.
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
  },
};

/**
 * Example of a button with a custom click handler.
 */
export const WithClickHandler: Story = {
  args: {
    variant: 'primary',
    children: 'Click Me',
    onClick: () => alert('Button clicked!'),
  },
};
