import type { ActionMenuItem } from "@/components/ui/ActionMenu/ActionMenu";
import ItemMenu from "@/components/common/ItemMenu";
import {
  useBlockUserMutation,
  useUnblockUserMutation,
} from "@/lib/usersQueries";
import { X } from "lucide-react";

interface AccountMenuProps {
  id: string;
  blocked_user?: boolean;
  className?: string;
}

const AccountMenu = ({
  id,
  blocked_user,
  className = "",
}: AccountMenuProps) => {
  const blockMutation = useBlockUserMutation();
  const unblockMutation = useUnblockUserMutation();

  const actions: ActionMenuItem[] = [
    {
      icon: <X />,
      text: blocked_user ? "Убрать из чс" : "Добавить в чс",
      onClick: () =>
        blocked_user ? unblockMutation.mutate(id) : blockMutation.mutate(id),
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
