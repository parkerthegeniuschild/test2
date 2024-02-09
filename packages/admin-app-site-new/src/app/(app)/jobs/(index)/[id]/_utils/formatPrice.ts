import { format } from '@/app/_utils';

export const formatPrice = (price: string | number) =>
  format.number(price, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
