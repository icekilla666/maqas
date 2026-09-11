import { useState, type ReactNode } from "react";
import { Info } from "lucide-react";
import Modal from "./Modal";

interface ModalActionsProps {
  open: boolean;
  text: ReactNode;
  infoText?: ReactNode;
  icon?: ReactNode;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

const ModalActions = ({
  open,
  text,
  infoText,
  icon,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isPending = false,
}: ModalActionsProps) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isInfoPinned, setIsInfoPinned] = useState(false);

  const toggleInfo = () => {
    if (isInfoPinned) {
      setIsInfoPinned(false);
      setIsInfoVisible(false);
      return;
    }

    setIsInfoPinned(true);
    setIsInfoVisible(true);
  };

  const resetInfo = () => {
    setIsInfoPinned(false);
    setIsInfoVisible(false);
  };

  const handleCancel = () => {
    if (isPending) return;
    resetInfo();
    onCancel();
  };

  const handleConfirm = () => {
    if (isPending) return;
    resetInfo();
    onConfirm();
  };

  return (
    <Modal open={open} onClose={handleCancel} className="modal--actions">
      <div className="modal-actions">
        <div className="modal-actions__content">
          <p className="modal-actions__text">{text}</p>
          {infoText && (
            <button
              aria-label="информация"
              className={`modal-actions__info ${
                isInfoVisible ? "active" : ""
              }`.trim()}
              onClick={toggleInfo}
              type="button"
            >
              {icon ?? <Info size={18} />}
              <span className="modal-actions__tooltip">{infoText}</span>
            </button>
          )}
        </div>
        <div className="modal-actions__buttons">
          <button
            className="modal-actions__button modal-actions__button--cancel"
            disabled={isPending}
            onClick={handleCancel}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className="modal-actions__button modal-actions__button--confirm"
            disabled={isPending}
            onClick={handleConfirm}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalActions;
