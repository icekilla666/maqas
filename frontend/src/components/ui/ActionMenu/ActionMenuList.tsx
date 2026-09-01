import StrokeButton from "@/components/ui/Buttons/StrokeButton";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";

export interface ActionMenuItem {
  icon?: ReactNode;
  text: string;
  onClick?: () => void;
  actions?: ActionMenuItem[];
  className?: string;
  isActive?: boolean;
}

interface ActionMenuListProps {
  actions: ActionMenuItem[];
  id: string;
  onBack?: () => void;
  onAction: (action: ActionMenuItem) => void;
  title?: string;
}

const ActionMenuList = ({
  actions,
  id,
  onBack,
  onAction,
  title,
}: ActionMenuListProps) => {
  const handleActionClick = (
    event: MouseEvent<HTMLButtonElement>,
    action: ActionMenuItem,
  ) => {
    event.stopPropagation();
    onAction(action);
  };

  return (
    <div className="action-menu__panel" id={id}>
      {title && onBack && (
        <button
          aria-label="Вернуться к предыдущему списку действий"
          className="action-menu__back"
          onClick={(event) => {
            event.stopPropagation();
            onBack();
          }}
          type="button"
        >
          <ChevronLeft size={18} />
          <span>{title}</span>
        </button>
      )}
      <ul className="action-menu__list" role="menu">
        {actions.map((action, index) => (
          <li key={`${action.text}-${index}`} role="none">
            <StrokeButton
              aria-current={action.isActive ? "true" : undefined}
              aria-haspopup={action.actions?.length ? "menu" : undefined}
              className={[
                "action-menu__item",
                action.isActive ? "active" : "",
                action.className ?? "",
              ]
                .filter(Boolean)
                .join(" ")}
              icon={action.icon}
              onClick={(event) => handleActionClick(event, action)}
              role="menuitem"
              type="button"
            >
              <span className="action-menu__item-text">{action.text}</span>
              {action.actions?.length ? (
                <ChevronRight className="action-menu__item-status" size={16} />
              ) : (
                action.isActive && (
                  <Check className="action-menu__item-status" size={16} />
                )
              )}
            </StrokeButton>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionMenuList;
