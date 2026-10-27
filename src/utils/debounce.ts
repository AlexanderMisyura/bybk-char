const DEBOUNCE_DELAY = 500;

export function debounce(func: Function, delay: number = DEBOUNCE_DELAY) {
  let timeoutId: number;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  };
}
