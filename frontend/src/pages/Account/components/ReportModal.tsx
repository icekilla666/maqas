import MainButton from "@/components/ui/Buttons/MainButton";
import Modal from "@/components/ui/Modals/Modal";
import { useState, type ChangeEvent, type FormEvent } from "react";

const reportReasons = [
  { value: "spam", label: "Спам или реклама" },
  { value: "harassment", label: "Оскорбления или травля" },
  { value: "hate", label: "Разжигание ненависти" },
  { value: "fake", label: "Фейковый аккаунт" },
  { value: "adult", label: "Неприемлемый контент" },
  { value: "scam", label: "Мошенничество" },
] as const;

type ReportReason = (typeof reportReasons)[number]["value"];

interface ReportModalProps {
  open: boolean;
  userId: string;
  onClose: () => void;
}

const ReportModal = ({ open, userId, onClose }: ReportModalProps) => {
  const [selectedReasons, setSelectedReasons] = useState<ReportReason[]>([]);
  const [comment, setComment] = useState("");

  const resetForm = () => {
    setSelectedReasons([]);
    setComment("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleReason = (reason: ReportReason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((selectedReason) => selectedReason !== reason)
        : [...prev, reason],
    );
  };

  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const reportData = {
      userId,
      reasons: selectedReasons,
      comment: comment.trim(),
    };

    console.log("report", reportData);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} className="modal--report">
      <form className="report-modal" onSubmit={handleSubmit}>
        <div className="report-modal__header">
          <h2 className="report-modal__title">Жалоба на аккаунт</h2>
          <p className="report-modal__subtitle">
            Выберите одну или несколько причин
          </p>
        </div>

        <div className="report-modal__reasons">
          {reportReasons.map((reason) => {
            const checked = selectedReasons.includes(reason.value);

            return (
              <label className="report-modal__reason" key={reason.value}>
                <input
                  checked={checked}
                  className="report-modal__checkbox"
                  onChange={() => toggleReason(reason.value)}
                  type="checkbox"
                />
                <span className="report-modal__checkmark" aria-hidden />
                <span className="report-modal__reason-text">{reason.label}</span>
              </label>
            );
          })}
        </div>

        <label className="report-modal__comment">
          <span className="report-modal__comment-label">Комментарий</span>
          <textarea
            className="report-modal__textarea"
            maxLength={500}
            onChange={handleCommentChange}
            placeholder="Опишите ситуацию"
            value={comment}
          />
        </label>

        <div className="report-modal__actions">
          <MainButton
            type="button"
            typesBtn="default"
            align="center"
            onClick={handleClose}
          >
            Отмена
          </MainButton>
          <MainButton
            disabled={!selectedReasons.length}
            type="submit"
            typesBtn="primary"
            align="center"
          >
            Отправить
          </MainButton>
        </div>
      </form>
    </Modal>
  );
};

export default ReportModal;
