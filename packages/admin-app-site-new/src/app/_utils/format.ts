function capitalize(string: string): string;
function capitalize(string: unknown): string | null;
function capitalize(string: unknown): string | null {
  if (typeof string !== 'string') {
    return null;
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const format = {
  phoneNumber(phoneNumber: string) {
    if (phoneNumber.length < 11) {
      throw new Error('Invalid phone number');
    }

    const areaCode = phoneNumber.slice(1, 4);
    const exchangeCode = phoneNumber.slice(4, 7);
    const subscriberNumber = phoneNumber.slice(7, 11);
    const extension = phoneNumber.slice(11);

    return `(${areaCode}) ${exchangeCode}-${subscriberNumber}${
      extension ? ` Ext ${extension}` : ''
    }`;
  },

  currency(number: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(number);
  },

  date(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  },

  number(number: number | string, options?: Intl.NumberFormatOptions) {
    return new Intl.NumberFormat('en', options).format(number as number);
  },

  string: {
    capitalize,
  },
};
