import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import ActionMenuList, { type ActionMenuItem } from "./ActionMenuList";

interface ContextMenuProps {
  children: ReactNode;
  actions: ActionMenuItem[];
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
}

const ContextMenu = ({ children, actions, ariaLabel, className = "", disabled = false }: ContextMenuProps) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isPressing, setIsPressing] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);
  const menuId = useId();

  const clearPress = () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = null;
    pressRef.current = null;
  };

  const cancelPress = () => {
    clearPress();
    setIsPressing(false);
  };

  const closeMenu = () => {
    targetRef.current?.focus({ preventScroll: true });
    setPosition(null);
  };

  useEffect(() => clearPress, [disabled]);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!position || !menu) return;

    const { width, height } = menu.getBoundingClientRect();
    const margin = 8;
    menu.style.left = `${Math.max(margin, Math.min(position.x, window.innerWidth - width - margin))}px`;
    menu.style.top = `${Math.max(margin, Math.min(position.y, window.innerHeight - height - margin))}px`;
    menu.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus({ preventScroll: true });
  }, [position]);

  useEffect(() => {
    if (!position) return;

    const onOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setPosition(null);
      }
    };
    const onScroll = (event: Event) => {
      // Прокрутка длинного меню не должна закрывать само меню.
      if (event.target instanceof Node && menuRef.current?.contains(event.target)) return;
      setPosition(null);
    };
    const onResize = () => setPosition(null);
    document.addEventListener("pointerdown", onOutsidePress, true);
    document.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("blur", onResize);
    return () => {
      document.removeEventListener("pointerdown", onOutsidePress, true);
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", onResize);
    };
  }, [position]);

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" || event.key === "Tab") {
      if (event.key === "Escape") event.preventDefault();
      event.stopPropagation();
      closeMenu();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
    if (!items.length) return;
    event.preventDefault();
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1
      : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  };

  // После завершения запроса ранее закрытое меню не должно появиться снова.
  if (disabled && (position !== null || isPressing)) {
    setPosition(null);
    setIsPressing(false);
  }

  return (
    <>
      <div
        ref={targetRef}
        className={[
          "context-menu-target",
          isPressing ? "context-menu-target--holding" : "",
          position ? "context-menu-target--open" : "",
          className,
        ].filter(Boolean).join(" ")}
        tabIndex={disabled ? undefined : 0}
        aria-label={ariaLabel}
        aria-haspopup={disabled ? undefined : "menu"}
        aria-controls={position ? menuId : undefined}
        onContextMenu={(event) => {
          if (disabled) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClickRef.current = true;
          cancelPress();
          setPosition({ x: event.clientX, y: event.clientY });
        }}
        onPointerDown={(event) => {
          cancelPress();
          suppressClickRef.current = false;
          if (disabled || !event.isPrimary || event.pointerType === "mouse" || event.button !== 0) return;
          const point = { x: event.clientX, y: event.clientY };
          pressRef.current = point;
          setIsPressing(true);
          timerRef.current = setTimeout(() => {
            timerRef.current = null;
            suppressClickRef.current = true;
            setIsPressing(false);
            setPosition(point);
          }, 500);
        }}
        onPointerMove={(event) => {
          const start = pressRef.current;
          if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) cancelPress();
        }}
        onPointerUp={cancelPress}
        onPointerCancel={cancelPress}
        onPointerLeave={cancelPress}
        onClickCapture={(event) => {
          // После удержания картинки не открываем ссылку обычным click.
          if (!suppressClickRef.current) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClickRef.current = false;
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            setPosition({ x: rect.left + 12, y: rect.top + 12 });
          }
        }}
      >
        {children}
      </div>
      {position && !disabled && createPortal(
        <div ref={menuRef} className="context-menu" onKeyDown={handleMenuKeyDown} onContextMenu={(event) => event.preventDefault()}>
          <ActionMenuList
            actions={actions}
            id={menuId}
            onAction={(action) => {
              closeMenu();
              action.onClick?.();
            }}
          />
        </div>,
        document.body,
      )}
    </>
  );
};

export default ContextMenu;
