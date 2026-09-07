import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { anchor } from "@/utils/anchor";

export const useAnchorScroll = (id: string, ready: boolean) => {
  const { hash, key } = useLocation();

  useEffect(() => {
    if (!ready || hash !== `#${id}`) return;
    return anchor(id);
  }, [hash, key, id, ready]);
};
