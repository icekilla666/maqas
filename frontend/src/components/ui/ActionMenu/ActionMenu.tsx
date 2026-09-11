import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import ActionMenuList, { type ActionMenuItem } from "./ActionMenuList";

export type { ActionMenuItem } from "./ActionMenuList";

interface ActionMenuProps {
  actions: ActionMenuItem[];
  icon: ReactNode;
  ariaLabel: string;
  className?: string;
}

const ActionMenu = ({
  actions,
  icon,
  ariaLabel,
  className = "",
}: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStack, setMenuStack] = useState<ActionMenuItem[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const activeMenu = menuStack.at(-1);
  const activeActions = activeMenu?.actions ?? actions;

  useEffect(() => {
    if (isOpen) menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
  }, [isOpen, menuStack]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
      setMenuStack([]);
      triggerRef.current?.focus();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
    if (!items.length) return;
    event.preventDefault();
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "Home" ? 0
      : event.key === "End" ? items.length - 1
        : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: globalThis.MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setMenuStack([]);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleMenuClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsOpen((open) => {
      if (open) {
        setMenuStack([]);
      }

      return !open;
    });
  };

  const handleAction = (action: ActionMenuItem) => {
    if (action.actions?.length) {
      setMenuStack((stack) => [...stack, action]);
      return;
    }

    setIsOpen(false);
    setMenuStack([]);
    triggerRef.current?.focus();
    action.onClick?.();
  };

  const handleBack = () => {
    setMenuStack((stack) => stack.slice(0, -1));
  };

  return (
    <div
      className="action-menu"
      onClick={handleMenuClick}
      onKeyDown={handleKeyDown}
      ref={menuRef}
    >
      <button
        ref={triggerRef}
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={ariaLabel}
        className={`action-menu__trigger ${className}`.trim()}
        onClick={handleToggle}
        type="button"
      >
        {icon}
      </button>
      {isOpen && (
        <ActionMenuList
          actions={activeActions}
          id={menuId}
          onBack={menuStack.length ? handleBack : undefined}
          onAction={handleAction}
          title={activeMenu?.text}
        />
      )}
    </div>
  );
};

export default ActionMenu;
