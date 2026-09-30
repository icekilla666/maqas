import { X } from "lucide-react";
import IconButton from "@/components/ui/Buttons/IconButton";

interface ChatAttachmentPreviewProps {
  url: string;
  fileName: string;
  onRemove: () => void;
  disabled: boolean;
}

const ChatAttachmentPreview = ({ url, fileName, onRemove, disabled }: ChatAttachmentPreviewProps) => (
  <div className="chat-composer__attachment">
    <img src={url} alt="Прикреплённое изображение" />
    <span>{fileName}</span>
    <IconButton
      type="button"
      size="small"
      onClick={onRemove}
      disabled={disabled}
      aria-label="Убрать изображение"
    >
      <X size={18} />
    </IconButton>
  </div>
);

export default ChatAttachmentPreview;
