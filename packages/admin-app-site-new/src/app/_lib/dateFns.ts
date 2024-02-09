import { formatDistanceToNowStrict } from 'date-fns';
import locale from 'date-fns/locale/en-US';

const SIMPLIFIED_FORMAT_DISTANCE_LOCALE = {
  lessThanXSeconds: '{{count}}s',
  xSeconds: '{{count}}s',
  halfAMinute: '30s',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
};

function simplifiedFormatDistance(
  token: keyof typeof SIMPLIFIED_FORMAT_DISTANCE_LOCALE,
  count: string,
  options = { addSuffix: false, comparison: 0 }
) {
  const result = SIMPLIFIED_FORMAT_DISTANCE_LOCALE[token].replace(
    '{{count}}',
    count
  );

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return `in ${result}`;
    }

    return `${result} ago`;
  }

  return result;
}

export function formatDistanceToNowStrictSimplified(
  date: Date | number,
  options?: Parameters<typeof formatDistanceToNowStrict>[1]
) {
  const distance = formatDistanceToNowStrict(date, {
    ...options,
    locale: {
      ...locale,
      formatDistance: simplifiedFormatDistance,
    },
  });

  return distance === 'in 0s' ? 'just now' : distance;
}

export * from 'date-fns';
