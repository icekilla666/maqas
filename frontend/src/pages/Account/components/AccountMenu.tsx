import StrokeButton from "@/components/ui/Buttons/StrokeButton";
import {
  useBlockUserMutation,
  useUnblockUserMutation,
} from "@/lib/usersQueries";
import { Ellipsis, Flag, X } from "lucide-react";
import { useState } from "react";
import ReportModal from "./ReportModal";

const AccountMenu = ({ id }: { id: string }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const blockMutation = useBlockUserMutation();
  const unblockMutation = useUnblockUserMutation();

  const handleReportClick = () => {
    setMenuOpen(false);
    setReportOpen(true);
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
          onClick={handleReportClick}
          icon={<Flag />}
          className="text-red"
          type="button"
        >
          пожаловаться
        </StrokeButton>
        <StrokeButton
          onClick={() => blockMutation.mutate(id)}
          icon={<X />}
          className="text-red"
          type="button"
        >
          добавить в чс
        </StrokeButton>
        <StrokeButton
          onClick={() => unblockMutation.mutate(id)}
          icon={<X />}
          className="text-red"
          type="button"
        >
          убрать из чс
        </StrokeButton>
      </div>
      <ReportModal
        open={reportOpen}
        userId={id}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
};

export default AccountMenu;
