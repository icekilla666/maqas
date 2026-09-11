import type { ActionMenuItem } from "@/components/ui/ActionMenu/ActionMenu";
import ItemMenu from "@/components/common/ItemMenu";
import {
  useBlockUserMutation,
  useUnblockUserMutation,
} from "@/lib/usersQueries";
import { X } from "lucide-react";

interface AccountMenuProps {
  id: string;
  className?: string;
}

const AccountMenu = ({ id, className = "" }: AccountMenuProps) => {
  const blockMutation = useBlockUserMutation();
  const unblockMutation = useUnblockUserMutation();

  const actions: ActionMenuItem[] = [
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
    <ItemMenu
      reportTarget="account"
      actions={actions}
      ariaLabel="Меню аккаунта"
      className={className}
    />
  );
};

export default AccountMenu;
