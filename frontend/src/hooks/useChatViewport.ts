import { useLayoutEffect, useRef } from "react";

// На телефоне клавиатура уменьшает visual viewport, но не всегда высоту страницы.
export const useChatViewport = () => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const viewport = window.visualViewport;
    let frame = 0;
    const update = () => {
      element.style.setProperty("--chat-viewport-height", `${viewport?.height ?? window.innerHeight}px`);
      element.style.setProperty("--chat-viewport-top", `${viewport?.offsetTop ?? 0}px`);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    viewport?.addEventListener("resize", schedule);
    viewport?.addEventListener("scroll", schedule);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", schedule);
      viewport?.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return ref;
};
