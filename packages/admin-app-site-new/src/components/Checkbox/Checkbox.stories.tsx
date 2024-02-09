import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './Checkbox';

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      include: [],
    },
  },
} satisfies Meta<typeof Checkbox>;

type Story = StoryObj<typeof Checkbox>;

export default meta;

export const Default: Story = {
  args: {
    children: 'Label',
    size: 'md',
  },
  parameters: {
    controls: {
      include: ['children', 'size'],
    },
  },
};

Default.render = ({ ...args }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [checked, setChecked] = useState<boolean | 'mixed'>(false);

  function handleCheckChange() {
    const OPTIONS = [false, true, 'mixed'] as const;

    const currentIndex = OPTIONS.indexOf(checked);
    const nextIndex = (currentIndex + 1) % OPTIONS.length;

    setChecked(OPTIONS[nextIndex]);
  }

  return <Checkbox {...args} checked={checked} onChange={handleCheckChange} />;
};
