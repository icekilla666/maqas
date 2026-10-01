import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";

export const useVerificationCooldown = (email?: string) => {
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const resendAt = useAuthStore((state) => state.verificationResendAt);
  const startCooldown = useAuthStore((state) => state.startVerificationCooldown);
  const [now, setNow] = useState(() => Date.now());
  const deadline = email && email === pendingEmail ? resendAt : 0;
  const isWaiting = deadline > now;

  useEffect(() => {
    if (!isWaiting) return;
    const update = () => setNow(Date.now());
    const timer = window.setInterval(update, 1000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [isWaiting]);

  const restart = () => {
    if (!email) return;
    startCooldown(email);
    setNow(Date.now());
  };

  return {
    cooldown: Math.max(0, Math.ceil((deadline - now) / 1000)),
    restart,
  };
};
