import { useState } from "react";
import { Ellipsis, Flag } from "lucide-react";
import ActionMenu, {
  type ActionMenuItem,
} from "@/components/ui/ActionMenu/ActionMenu";
import ReportModal, { type ReportTarget } from "./ReportModal";

interface ItemMenuProps {
  reportTarget: ReportTarget;
  actions?: ActionMenuItem[];
  ariaLabel: string;
  className?: string;
}

const ItemMenu = ({
  reportTarget,
  actions = [],
  ariaLabel,
  className,
}: ItemMenuProps) => {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="item-menu" onClick={(event) => event.stopPropagation()}>
      <ActionMenu
        actions={[
          ...actions,
          {
            text: "Пожаловаться",
            icon: <Flag size={17} />,
            onClick: () => setReportOpen(true),
            className: "text-red",
          },
        ]}
        icon={<Ellipsis size={20} />}
        ariaLabel={ariaLabel}
        className={className}
      />
      {reportOpen && (
        <ReportModal
          open
          targetType={reportTarget}
          onClose={() => setReportOpen(false)}
        />
      )}
    </div>
  );
};

export default ItemMenu;
