export function nextTickScheduler(callback: () => void) {
  return setTimeout(callback, 1);
}
