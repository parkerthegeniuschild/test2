export type OrderModel<T extends string = string> = Partial<
  Record<T, 'asc' | 'desc' | 'none' | undefined>
>;
