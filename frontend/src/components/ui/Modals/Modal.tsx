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
}

const Modal = ({
  children,
  open,
  onClose,
  fullscreen = false,
  className = "",
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
