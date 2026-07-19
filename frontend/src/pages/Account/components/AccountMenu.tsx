import StrokeButton from "@/components/ui/Buttons/StrokeButton";
import {
  useBlockUserMutation,
  useUnblockUserMutation,
} from "@/lib/usersQueries";
import { Ellipsis, Flag, X } from "lucide-react";
import { useState } from "react";

interface AccountMenuProps {
  id: string;
}

const AccountMenu = ({ id }: AccountMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const blockMutation = useBlockUserMutation();
  const unblockMutation = useUnblockUserMutation();

  return (
    <div className="account__menu-wrapper">
      <button
        className="account__menu"
        type="button"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <Ellipsis size={17} />
      </button>
      <div
        className={`account__menu-panel ${menuOpen ? "open" : ""}`.trim()}
        aria-hidden={!menuOpen}
      >
        <StrokeButton
          onClick={() => console.log("rep")}
          icon={<Flag />}
          className="text-red"
        >
          пожаловаться
        </StrokeButton>
        <StrokeButton
          onClick={() => blockMutation.mutate(id)}
          icon={<X />}
          className="text-red"
        >
          добавить в чс
        </StrokeButton>
        <StrokeButton
          onClick={() => unblockMutation.mutate(id)}
          icon={<X />}
          className="text-red"
        >
          убрать из чс
        </StrokeButton>
      </div>
    </div>
  );
};

export default AccountMenu;
