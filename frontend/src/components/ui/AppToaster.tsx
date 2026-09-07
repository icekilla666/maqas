import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Toaster } from "sonner";

const AppToaster = () => {
  const [container] = useState(() => {
    const element = document.createElement("div");
    element.id = "app-toast-root";
    return element;
  });

  useEffect(() => {
    const dialogs = document.querySelectorAll("dialog[open]");
    const parent = dialogs.item(dialogs.length - 1) ?? document.body;
    parent.append(container);

    return () => container.remove();
  }, [container]);

  // A stable portal keeps active notifications when its container moves.
  return createPortal(
    <Toaster
      className="app-toaster"
      closeButton
      duration={4500}
      gap={10}
      mobileOffset={16}
      offset={24}
      position="top-right"
      toastOptions={{ className: "app-toast" }}
    />,
    container,
  );
};

export default AppToaster;
