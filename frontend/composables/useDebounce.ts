export function useDebounce() {
  const debounce = (fn: Function, delay: number) => {
    let timeout: NodeJS.Timeout;

    return function (...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  return {
    debounce,
  };
}
