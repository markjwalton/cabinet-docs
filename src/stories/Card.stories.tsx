import type { Meta, StoryObj } from '@storybook/react';
import Card from '../components/ui/cards/Card';

/**
 * # Card Component
 * 
 * A versatile card component for containing content with optional title, actions, and clickable state.
 * Provides consistent styling and layout for card-based UI elements.
 * 
 * ## Usage
 * 
 * ```tsx
 * import Card from '../components/ui/cards/Card';
 * 
 * // Basic card
 * <Card>
 *   <p className="p-4">Card content goes here</p>
 * </Card>
 * 
 * // Card with title
 * <Card title="Card Title">
 *   <p className="p-4">Card content goes here</p>
 * </Card>
 * 
 * // Clickable card
 * <Card 
 *   clickable 
 *   onClick={() => console.log('Card clicked')}
 * >
 *   <p className="p-4">Click me!</p>
 * </Card>
 * ```
 */
const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile card component for containing content with optional title, actions, and clickable state.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The content to display inside the card',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional title displayed at the top of the card',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    titleAction: {
      control: 'text',
      description: 'Optional action element displayed in the title bar',
      table: {
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    clickable: {
      control: 'boolean',
      description: 'Whether the card is clickable',
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
    onClick: {
      action: 'clicked',
      description: 'Function called when the card is clicked (if clickable)',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

/**
 * The default card with just content.
 */
export const Default: Story = {
  args: {
    children: <p className="p-4">This is the content of the card. You can put any React elements here.</p>,
  },
};

/**
 * Card with a title.
 */
export const WithTitle: Story = {
  args: {
    title: 'Card Title',
    children: <p className="p-4">This card has a title displayed at the top.</p>,
  },
};

/**
 * Card with a title and an action button.
 */
export const WithTitleAction: Story = {
  args: {
    title: 'Card with Action',
    titleAction: <button className="text-blue-500 hover:text-blue-700">Action</button>,
    children: <p className="p-4">This card has a title and an action button in the title bar.</p>,
  },
};

/**
 * Clickable card that responds to click events.
 */
export const Clickable: Story = {
  args: {
    clickable: true,
    children: <p className="p-4">This card is clickable. Try clicking on it!</p>,
  },
};

/**
 * Card with elevated shadow styling.
 */
export const Elevated: Story = {
  args: {
    className: 'shadow-lg',
    children: <p className="p-4">This card has an elevated appearance with a larger shadow.</p>,
  },
};

/**
 * Card with custom background color.
 */
export const ColoredBackground: Story = {
  args: {
    className: 'bg-blue-50',
    title: 'Colored Card',
    children: <p className="p-4">This card has a custom background color.</p>,
  },
};

/**
 * Card with gradient background.
 */
export const GradientBackground: Story = {
  args: {
    className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
    children: <p className="p-4">This card has a gradient background with white text.</p>,
  },
};

/**
 * Card with rounded corners.
 */
export const RoundedCorners: Story = {
  args: {
    className: 'rounded-xl',
    children: <p className="p-4">This card has more rounded corners than the default.</p>,
  },
};

/**
 * Card with no border.
 */
export const BorderlessCard: Story = {
  args: {
    className: 'border-0 shadow',
    children: <p className="p-4">This card has no border, only shadow.</p>,
  },
};

/**
 * Card with complex content including multiple elements.
 */
export const ComplexContent: Story = {
  args: {
    title: 'Complex Card',
    children: (
      <div className="p-4">
        <p className="mb-4">This card contains multiple elements including text, images, and actions.</p>
        <div className="bg-gray-100 p-3 rounded mb-4">
          <code>Some code or special content here</code>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    ),
  },
};
