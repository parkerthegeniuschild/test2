import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Truckup',
    brandImage: '/assets/truckup_logo.svg',
  }),
});
