import type { OrderModel } from '@/app/_types/order';

export function mountOrderObject<T extends string>(
  orderObject?: OrderModel<T> | null
) {
  const parsedOrder = Object.fromEntries(
    Object.entries(orderObject ?? {}).filter(
      ([, value]) => value && value !== 'none'
    )
  );

  return Object.keys(parsedOrder).length > 0
    ? {
        sort: Object.keys(parsedOrder).join(','),
        order: Object.values(parsedOrder).join(','),
      }
    : {};
}
