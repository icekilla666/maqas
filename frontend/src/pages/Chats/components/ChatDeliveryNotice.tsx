import { TriangleAlert } from "lucide-react";
import StrokeButton from "@/components/ui/Buttons/StrokeButton";

interface ChatDeliveryNoticeProps {
  isChecking: boolean;
  onCheck: () => void;
  onDismiss: () => void;
}

const ChatDeliveryNotice = ({ isChecking, onCheck, onDismiss }: ChatDeliveryNoticeProps) => (
  <div className="chat-delivery-notice" role="status">
    <TriangleAlert size={18} aria-hidden="true" />
    <div>
      <strong>Не удалось подтвердить отправку</strong>
      <p>Сообщение могло отправиться. Проверьте последние сообщения перед повторной отправкой. Удаление карточки ожидания не отменяет отправку на сервере.</p>
      <div className="chat-delivery-notice__actions">
        <StrokeButton type="button" onClick={onCheck} disabled={isChecking}>
          {isChecking ? "Проверяем…" : "Проверить чат"}
        </StrokeButton>
        <StrokeButton type="button" onClick={onDismiss}>
          Убрать из ожидания
        </StrokeButton>
      </div>
    </div>
  </div>
);

export default ChatDeliveryNotice;
