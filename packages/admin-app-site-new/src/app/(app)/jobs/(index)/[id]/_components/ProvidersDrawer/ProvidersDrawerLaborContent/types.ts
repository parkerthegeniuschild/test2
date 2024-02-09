export type EarningsFocusedSection =
  | { action: 'create' }
  | { action: 'edit'; id: number }
  | { action: 'edit'; earning: 'per_hour' | 'callout' };
