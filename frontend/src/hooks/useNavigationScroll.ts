import type { MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import { CHATS_PAGE, HOME_PAGE } from "@/utils/constants";

export const useNavigationScroll = () => {
  const { pathname } = useLocation();
  return (event: MouseEvent<HTMLAnchorElement>, to: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (pathname !== to || (to !== HOME_PAGE && to !== CHATS_PAGE)) return;
    event.preventDefault();
    if (to === CHATS_PAGE) {
      document.querySelector(".chat-workspace__directory")?.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
};
