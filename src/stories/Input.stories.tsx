import type { Meta, StoryObj } from '@storybook/react';
import Input from '../components/ui/forms/Input';

/**
 * # Input Component
 * 
 * A versatile input field component with label, error handling, and help text support.
 * Supports various input types, states, and styling options.
 * 
 * ## Usage
 * 
 * ```tsx
 * import Input from '../components/ui/forms/Input';
 * 
 * // Basic text input
 * <Input 
 *   id="username"
 *   label="Username"
 *   value={username}
 *   onChange={(e) => setUsername(e.target.value)}
 * />
 * 
 * // Required email input
 * <Input 
 *   id="email"
 *   label="Email Address"
 *   type="email"
 *   required
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 * 
 * // Number input with constraints
 * <Input 
 *   id="age"
 *   label="Age"
 *   type="number"
 *   min={18}
 *   max={100}
 *   value={age}
 *   onChange={(e) => setAge(e.target.value)}
 * />
 * ```
 */
const meta: Meta<typeof Input> = {
  title: 'Form/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile input field component with label, error handling, and help text support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the input field',
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the input',
      table: {
        type: { summary: 'string' },
      },
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'search', 'color'],
      description: 'Type of input field',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
      },
    },
    value: {
      control: 'text',
      description: 'Current value of the input field',
      table: {
        type: { summary: 'string | number' },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Function called when the input value changes',
      table: {
        type: { summary: '(event: React.ChangeEvent<HTMLInputElement>) => void' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when input is empty',
      table: {
        type: { summary: 'string' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    min: {
      control: 'number',
      description: 'Minimum value for number inputs',
      table: {
        type: { summary: 'number' },
      },
    },
    max: {
      control: 'number',
      description: 'Maximum value for number inputs',
      table: {
        type: { summary: 'number' },
      },
    },
    step: {
      control: 'number',
      description: 'Step value for number inputs',
      table: {
        type: { summary: 'number' },
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
      description: 'Help text to display below the input',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

/**
 * Basic text input field.
 */
export const Default: Story = {
  args: {
    id: 'default',
    label: 'Username',
    value: '',
    placeholder: 'Enter your username',
  },
};

/**
 * Email input field with validation pattern.
 */
export const Email: Story = {
  args: {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    value: '',
    placeholder: 'example@domain.com',
  },
};

/**
 * Password input field with masked text.
 */
export const Password: Story = {
  args: {
    id: 'password',
    label: 'Password',
    type: 'password',
    value: 'secretpassword',
    placeholder: 'Enter your password',
  },
};

/**
 * Number input field with min, max, and step constraints.
 */
export const Number: Story = {
  args: {
    id: 'number',
    label: 'Age',
    type: 'number',
    value: 25,
    min: 18,
    max: 100,
    step: 1,
  },
};

/**
 * Date input field with calendar picker.
 */
export const Date: Story = {
  args: {
    id: 'date',
    label: 'Birth Date',
    type: 'date',
    value: '2000-01-01',
  },
};

/**
 * Color input field with color picker.
 */
export const Color: Story = {
  args: {
    id: 'color',
    label: 'Choose a Color',
    type: 'color',
    value: '#3b82f6',
  },
};

/**
 * Required input field with asterisk indicator.
 */
export const Required: Story = {
  args: {
    id: 'required',
    label: 'Full Name',
    value: '',
    required: true,
    placeholder: 'Enter your full name',
  },
};

/**
 * Disabled input field that cannot be edited.
 */
export const Disabled: Story = {
  args: {
    id: 'disabled',
    label: 'Read-only Field',
    value: 'This field cannot be edited',
    disabled: true,
  },
};

/**
 * Input field with an error message.
 */
export const WithError: Story = {
  args: {
    id: 'with-error',
    label: 'Username',
    value: 'invalid!',
    error: 'Username can only contain letters, numbers, and underscores',
  },
};

/**
 * Input field with help text.
 */
export const WithHelpText: Story = {
  args: {
    id: 'with-help',
    label: 'Password',
    type: 'password',
    value: '',
    placeholder: 'Enter a strong password',
    helpText: 'Password must be at least 8 characters and include a number and special character',
  },
};

/**
 * Input with custom styling - rounded corners.
 */
export const RoundedStyle: Story = {
  args: {
    id: 'rounded',
    label: 'Rounded Input',
    value: '',
    placeholder: 'This input has rounded corners',
    className: 'rounded-full',
  },
};

/**
 * Input with custom styling - colored border.
 */
export const ColoredBorder: Story = {
  args: {
    id: 'colored-border',
    label: 'Colored Border Input',
    value: '',
    placeholder: 'This input has a colored border',
    className: 'border-blue-500 focus:border-blue-700 focus:ring-blue-500',
  },
};

/**
 * Input with custom styling - background color.
 */
export const ColoredBackground: Story = {
  args: {
    id: 'colored-bg',
    label: 'Colored Background Input',
    value: '',
    placeholder: 'This input has a colored background',
    className: 'bg-blue-50 border-blue-200',
  },
};

/**
 * Input with custom styling - larger size.
 */
export const LargeInput: Story = {
  args: {
    id: 'large',
    label: 'Large Input',
    value: '',
    placeholder: 'This is a larger input field',
    className: 'text-lg py-3 px-4',
  },
};

/**
 * Input with custom styling - smaller size.
 */
export const SmallInput: Story = {
  args: {
    id: 'small',
    label: 'Small Input',
    value: '',
    placeholder: 'This is a smaller input field',
    className: 'text-xs py-1 px-2',
  },
};
