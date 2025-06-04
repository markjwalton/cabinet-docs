import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from '../components/ui/forms/Checkbox';

/**
 * # Checkbox Component
 * 
 * A checkbox component that allows users to select one or multiple items from a set.
 * Supports different states including checked, unchecked, disabled, and with error messages.
 * 
 * ## Usage
 * 
 * ```tsx
 * import Checkbox from '../components/ui/forms/Checkbox';
 * 
 * // Basic checkbox
 * <Checkbox 
 *   id="terms"
 *   label="I agree to the terms and conditions"
 *   checked={isChecked}
 *   onChange={(e) => setIsChecked(e.target.checked)}
 * />
 * 
 * // Required checkbox
 * <Checkbox 
 *   id="privacy"
 *   label="I agree to the privacy policy"
 *   required
 *   checked={isPrivacyAccepted}
 *   onChange={(e) => setIsPrivacyAccepted(e.target.checked)}
 * />
 * 
 * // Disabled checkbox
 * <Checkbox 
 *   id="disabled-option"
 *   label="Unavailable option"
 *   disabled
 * />
 * ```
 */
const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A checkbox component that allows users to select one or multiple items from a set.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the checkbox',
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text displayed next to the checkbox',
      table: {
        type: { summary: 'string' },
      },
    },
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
      table: {
        type: { summary: 'boolean' },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Function called when the checkbox state changes',
      table: {
        type: { summary: '(event: React.ChangeEvent<HTMLInputElement>) => void' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the checkbox is required',
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
    error: {
      control: 'text',
      description: 'Error message to display',
      table: {
        type: { summary: 'string' },
      },
    },
    helpText: {
      control: 'text',
      description: 'Help text to display below the checkbox',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

/**
 * The default unchecked checkbox.
 */
export const Default: Story = {
  args: {
    id: 'default',
    label: 'Default checkbox',
  },
};

/**
 * Checkbox in a checked state.
 */
export const Checked: Story = {
  args: {
    id: 'checked',
    label: 'Checked checkbox',
    checked: true,
  },
};

/**
 * Disabled checkbox that cannot be interacted with.
 */
export const Disabled: Story = {
  args: {
    id: 'disabled',
    label: 'Disabled checkbox',
    disabled: true,
  },
};

/**
 * Disabled and checked checkbox.
 */
export const DisabledChecked: Story = {
  args: {
    id: 'disabled-checked',
    label: 'Disabled checked checkbox',
    disabled: true,
    checked: true,
  },
};

/**
 * Required checkbox with an asterisk indicator.
 */
export const Required: Story = {
  args: {
    id: 'required',
    label: 'Required checkbox',
    required: true,
  },
};

/**
 * Checkbox with an error message.
 */
export const WithError: Story = {
  args: {
    id: 'with-error',
    label: 'Checkbox with error',
    error: 'This field is required',
  },
};

/**
 * Checkbox with help text.
 */
export const WithHelpText: Story = {
  args: {
    id: 'with-help',
    label: 'Checkbox with help text',
    helpText: 'Additional information about this option',
  },
};

/**
 * Checkbox with custom styling - larger size.
 */
export const LargeCheckbox: Story = {
  args: {
    id: 'large',
    label: 'Large checkbox',
    className: 'scale-125',
  },
};

/**
 * Checkbox with custom styling - colored label.
 */
export const ColoredLabel: Story = {
  args: {
    id: 'colored-label',
    label: 'Checkbox with colored label',
    className: 'text-blue-600 font-medium',
  },
};

/**
 * Checkbox with custom styling - rounded container.
 */
export const RoundedContainer: Story = {
  args: {
    id: 'rounded-container',
    label: 'Checkbox in rounded container',
    className: 'bg-gray-50 p-3 rounded-lg border border-gray-200',
  },
};

/**
 * Checkbox with custom styling - highlighted background.
 */
export const HighlightedBackground: Story = {
  args: {
    id: 'highlighted',
    label: 'Highlighted checkbox',
    checked: true,
    className: 'bg-blue-50 p-2 rounded border border-blue-200',
  },
};
