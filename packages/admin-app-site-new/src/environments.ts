export function isClient() {
  return typeof window !== 'undefined';
}

export function isServer() {
  return typeof window === 'undefined';
}
