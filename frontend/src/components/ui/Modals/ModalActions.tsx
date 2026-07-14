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
    resetInfo();
    onCancel();
  };

  const handleConfirm = () => {
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
            onClick={handleCancel}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className="modal-actions__button modal-actions__button--confirm"
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
