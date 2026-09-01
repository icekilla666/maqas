import ActionMenu, {
  type ActionMenuItem,
} from "@/components/ui/ActionMenu/ActionMenu";
import {
  useBlockUserMutation,
  useUnblockUserMutation,
} from "@/lib/usersQueries";
import { Ellipsis, Flag, X } from "lucide-react";
import { useState } from "react";
import ReportModal from "./ReportModal";

interface AccountMenuProps {
  id: string;
  className?: string;
}

const AccountMenu = ({ id, className = "" }: AccountMenuProps) => {
  const [reportOpen, setReportOpen] = useState(false);
  const blockMutation = useBlockUserMutation();
  const unblockMutation = useUnblockUserMutation();

  const handleReportClick = () => {
    setReportOpen(true);
  };

  const actions: ActionMenuItem[] = [
    {
      icon: <Flag />,
      text: "пожаловаться",
      onClick: handleReportClick,
      className: "text-red",
    },
    {
      icon: <X />,
      text: "добавить в чс",
      onClick: () => blockMutation.mutate(id),
      className: "text-red",
    },
    {
      icon: <X />,
      text: "убрать из чс",
      onClick: () => unblockMutation.mutate(id),
      className: "text-red",
    },
  ];

  return (
    <>
      <ActionMenu
        actions={actions}
        ariaLabel="Открыть меню действий"
        className={className}
        icon={<Ellipsis size={17} />}
      />
      <ReportModal
        open={reportOpen}
        userId={id}
        onClose={() => setReportOpen(false)}
      />
    </>
  );
};

export default AccountMenu;
