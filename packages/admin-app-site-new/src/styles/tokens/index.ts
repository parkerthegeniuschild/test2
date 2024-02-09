import { defineTokens } from '@pandacss/dev';

import { colors } from './colors';
import { fonts, fontSizes, fontWeights, lineHeights } from './fonts';
import { radii } from './radii';
import { shadows } from './shadows';
import { spacing } from './spacings';
import { durations, easings } from './transitions';
import { zIndex } from './zIndices';

export { keyframes } from './animations';

export const tokens = defineTokens({
  colors,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  shadows,
  spacing,
  durations,
  easings,
  zIndex,
});
