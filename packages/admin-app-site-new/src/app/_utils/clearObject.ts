/**
 * Removes falsy values from an object and trims its string values.
 */
export function clearObject<T extends Record<string, unknown>>(obj: T) {
  return Object.keys(obj).reduce((acc, key: keyof T) => {
    const value = obj[key];

    if (
      (typeof value !== 'string' && !!value) ||
      (typeof value === 'string' && !!value.trim())
    ) {
      acc[key] =
        typeof value === 'string' ? (value.trim() as T[keyof T]) : value;
    }

    return acc;
  }, {} as T);
}
