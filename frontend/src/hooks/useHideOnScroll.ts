import { useState, useEffect, useRef } from "react";

export const useHideOnScroll = () => {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollPositionRef = useRef(0);
  const scrollFrameRef = useRef<number | null>(null);

  useEffect(() => {
    lastScrollPositionRef.current = window.scrollY;

    const handleScroll = () => {
      if (scrollFrameRef.current !== null) return;

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        const currentScrollPosition = window.scrollY;
        const scrollDelta =
          currentScrollPosition - lastScrollPositionRef.current;

        if (currentScrollPosition <= 32) {
          setIsHidden(false);
          lastScrollPositionRef.current = currentScrollPosition;
        } else if (Math.abs(scrollDelta) >= 8) {
          setIsHidden(scrollDelta > 0);
          lastScrollPositionRef.current = currentScrollPosition;
        }

        scrollFrameRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);
  return isHidden;
};
