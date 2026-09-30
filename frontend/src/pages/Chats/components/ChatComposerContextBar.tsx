import { Pencil, Reply, X } from "lucide-react";
import IconButton from "@/components/ui/Buttons/IconButton";
import type { ChatComposerContext } from "@/hooks/useChatComposer";
import { getChatMessagePreview } from "@/utils/sharedPost";

interface ChatComposerContextBarProps {
  context: ChatComposerContext;
  onCancel: () => void;
  disabled: boolean;
}

const ChatComposerContextBar = ({ context, onCancel, disabled }: ChatComposerContextBarProps) => {
  const isEditing = context.type === "edit";

  return (
    <div className="chat-composer__context">
      {isEditing ? <Pencil size={18} /> : <Reply size={18} />}
      <div>
        <strong>
          {isEditing
            ? "Редактирование"
            : `Ответ ${context.message.sender.name || context.message.sender.username}`}
        </strong>
        <span>{getChatMessagePreview(context.message)}</span>
      </div>
      <IconButton
        type="button"
        size="small"
        onClick={onCancel}
        disabled={disabled}
        aria-label="Отменить"
      >
        <X size={18} />
      </IconButton>
    </div>
  );
};

export default ChatComposerContextBar;
