import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { isInstalledApp } from "@/utils/installInstructions";

const PULL_THRESHOLD = 140;

// Вложенные списки и элементы управления сохраняют свои обычные жесты.
const canStartPull = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false;
  if (document.querySelector("dialog[open], [role='dialog'], [role='menu']")) return false;
  if (target.closest("input, textarea, select, button, a, [contenteditable='true'], .chat-messages")) return false;
  if (document.activeElement?.matches("input, textarea, select, [contenteditable='true']")) return false;
  if (window.scrollY > 0 || (document.scrollingElement?.scrollTop ?? 0) > 0) return false;
  if ((window.visualViewport?.scale ?? 1) !== 1) return false;
  if (window.getSelection()?.toString()) return false;

  for (let element: Element | null = target; element && element !== document.body; element = element.parentElement) {
    const style = getComputedStyle(element);
    if (/(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight) return false;
    if (/(auto|scroll)/.test(style.overflowX) && element.scrollWidth > element.clientWidth) return false;
  }
  return true;
};

const PwaPullToRefresh = () => {
  const [distance, setDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isInstalledApp()) return;

    let start: { x: number; y: number } | null = null;
    let pull = 0;
    let reloading = false;
    let reloadTimer: ReturnType<typeof setTimeout> | undefined;
    document.documentElement.classList.add("pwa-pull-to-refresh");

    const reset = () => {
      start = null;
      pull = 0;
      if (!reloading) setDistance(0);
    };
    const onStart = (event: TouchEvent) => {
      reset();
      if (reloading || event.touches.length !== 1 || !canStartPull(event.target)) return;
      start = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    };
    const onMove = (event: TouchEvent) => {
      if (!start) return;
      if (event.touches.length !== 1 || !event.cancelable) return reset();
      const dx = Math.abs(event.touches[0].clientX - start.x);
      const dy = event.touches[0].clientY - start.y;
      if (dy < 0 || dx > Math.max(10, dy)) return reset();
      if (dy < 8 && !pull) return;
      event.preventDefault();
      pull = Math.min(dy, PULL_THRESHOLD * 1.5);
      setDistance(pull);
    };
    const onEnd = () => {
      if (!start || pull < PULL_THRESHOLD) return reset();
      start = null;
      reloading = true;
      setRefreshing(true);
      // Даём браузеру отрисовать индикатор перед полной перезагрузкой.
      reloadTimer = setTimeout(() => window.location.reload(), 100);
    };
    const onVisibilityChange = () => {
      if (document.hidden) reset();
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
    document.addEventListener("touchcancel", reset);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearTimeout(reloadTimer);
      document.documentElement.classList.remove("pwa-pull-to-refresh");
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", reset);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!distance && !refreshing) return null;

  return (
    <div
      className="pwa-refresh-indicator"
      role="status"
      style={{ transform: `translate(-50%, ${Math.min(distance * 0.4, 72)}px)` }}
    >
      <RotateCw
        size={20}
        aria-hidden
        className={refreshing ? "animate-spin" : undefined}
        style={refreshing ? undefined : { transform: `rotate(${distance * 1.5}deg)` }}
      />
      <span>{refreshing ? "Перезагрузка…" : distance >= PULL_THRESHOLD ? "Отпустите, чтобы обновить" : "Потяните для обновления"}</span>
    </div>
  );
};

export default PwaPullToRefresh;
