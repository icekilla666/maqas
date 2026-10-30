import { useUnreadChats } from "@/hooks/useUnreadChats";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";

export const Navigation = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const hasUnread = useUnreadChats();

  return isDesktop ? <DesktopNavigation hasUnread={hasUnread} /> : <MobileNavigation hasUnread={hasUnread} />;
};
