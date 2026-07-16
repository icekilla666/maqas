import StrokeButton from "@/components/ui/Buttons/StrokeButton";
import { usersApi } from "@/services/users.api";
import { Ellipsis, Flag, X } from "lucide-react";
import { useState } from "react";

interface AccountMenuProps {
  id: string;
  is_blocked: boolean;
}

const AccountMenu = ({ id, is_blocked }: AccountMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleBlackList = async () => {
    console.log(is_blocked);
    try {
      const data = await usersApi.blockUser(id);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
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
          onClick={handleBlackList}
          icon={<X />}
          className="text-red"
        >
          добавить в чс
        </StrokeButton>
        <StrokeButton
          onClick={async () => await usersApi.unblockUser(id)}
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
