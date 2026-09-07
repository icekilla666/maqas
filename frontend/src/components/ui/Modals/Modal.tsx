import {
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";

interface ModalProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  fullscreen?: boolean;
  className?: string;
  ariaLabel?: string;
}

const Modal = ({
  children,
  open,
  onClose,
  fullscreen = false,
  className = "",
  ariaLabel,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const toastRoot = document.getElementById("app-toast-root");
    if (!open || !dialog || !toastRoot) return;

    const previousParent = toastRoot.parentElement;
    // showModal puts the dialog above the page, regardless of z-index.
    dialog.append(toastRoot);

    return () => {
      if (toastRoot.parentElement !== dialog) return;

      const canRestore =
        previousParent?.isConnected &&
        (!(previousParent instanceof HTMLDialogElement) || previousParent.open);
      (canRestore ? previousParent : document.body).append(toastRoot);
    };
  }, [open]);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  const modalClassName = [
    "modal",
    fullscreen ? "modal--fullscreen" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <dialog
      aria-label={ariaLabel}
      className={modalClassName}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <div className="modal__window">{children}</div>
    </dialog>
  );
};

export default Modal;
