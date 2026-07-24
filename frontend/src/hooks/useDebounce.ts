import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay = 400) => {
  const [debounce, setDebounce] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, value]);
  
  return debounce;
};
