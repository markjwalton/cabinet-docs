import type { Meta, StoryObj } from '@storybook/react';
import Button from '../components/ui/buttons/Button';

/**
 * # Button Component
 * 
 * A versatile button component that supports multiple variants, sizes, states, and can function as a link.
 * 
 * ## Features
 * - Multiple visual variants (primary, secondary, outline, danger, success, ghost, warning)
 * - Different sizes (small/sm, medium/md, large/lg)
 * - Loading state with spinner
 * - Icon support (left or right position)
 * - Can be rendered as a link with href
 * - Full width option
 * 
 * ## Usage
 * 
 * ```tsx
 * import Button from '../components/ui/buttons/Button';
 * 
 * // Basic button
 * <Button>Click Me</Button>
 * 
 * // Primary button with onClick handler
 * <Button 
 *   variant="primary" 
 *   onClick={() => console.log('Button clicked')}
 * >
 *   Submit
 * </Button>
 * 
 * // Danger button with loading state
 * <Button 
 *   variant="danger" 
 *   isLoading={isSubmitting}
 * >
 *   Delete Item
 * </Button>
 * 
 * // Button as link
 * <Button 
 *   variant="outline" 
 *   href="/dashboard"
 * >
 *   Go to Dashboard
 * </Button>
 * ```
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'danger', 'success', 'ghost', 'warning'],
      description: 'Visual style variant of the button',
      table: {
        type: { summary: 'ButtonVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'sm', 'md', 'lg'],
      description: 'Size of the button',
      table: {
        type: { summary: 'ButtonSize' },
        defaultValue: { summary: 'medium' },
      },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'HTML button type attribute',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'button' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when the button is clicked',
      table: {
        type: { summary: '(e: React.MouseEvent<HTMLButtonElement>) => void' },
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
    isLoading: {
      control: 'boolean',
      description: 'Whether to show a loading spinner',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    icon: {
      control: 'text',
      description: 'Icon element to display alongside text',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Position of the icon relative to text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'left' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take up the full width of its container',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    href: {
      control: 'text',
      description: 'URL to navigate to when clicked (renders as a link)',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      control: 'text',
      description: 'Button content',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Icon component for examples
const IconExample = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"></path>
    <path d="M12 5l7 7-7 7"></path>
  </svg>
);

/**
 * Default primary button.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

/**
 * Secondary button with muted styling.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

/**
 * Outline button with border and transparent background.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

/**
 * Danger button for destructive actions.
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
};

/**
 * Success button for confirming or completing actions.
 */
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success Button',
  },
};

/**
 * Ghost button with minimal styling.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

/**
 * Warning button for cautionary actions.
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning Button',
  },
};

/**
 * Small-sized button.
 */
export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small Button',
  },
};

/**
 * Medium-sized button (default).
 */
export const Medium: Story = {
  args: {
    size: 'medium',
    children: 'Medium Button',
  },
};

/**
 * Large-sized button.
 */
export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large Button',
  },
};

/**
 * Button with loading spinner.
 */
export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading Button',
  },
};

/**
 * Disabled button that cannot be clicked.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

/**
 * Button with an icon on the left side.
 */
export const WithLeftIcon: Story = {
  args: {
    icon: <IconExample />,
    iconPosition: 'left',
    children: 'Button with Left Icon',
  },
};

/**
 * Button with an icon on the right side.
 */
export const WithRightIcon: Story = {
  args: {
    icon: <IconExample />,
    iconPosition: 'right',
    children: 'Button with Right Icon',
  },
};

/**
 * Full-width button that spans its container.
 */
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
};

/**
 * Button that functions as a link.
 */
export const AsLink: Story = {
  args: {
    href: '#',
    children: 'Button as Link',
  },
};

/**
 * Submit button for forms.
 */
export const Submit: Story = {
  args: {
    type: 'submit',
    variant: 'primary',
    children: 'Submit Form',
  },
};
