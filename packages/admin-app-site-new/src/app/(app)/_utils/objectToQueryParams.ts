export function objectToQueryParams(object: Record<string, unknown>) {
  return Object.entries(object)
    .filter(([, value]) => typeof value === 'number' || Boolean(value))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}
