import { Check, ImagePlus, LoaderCircle, SendHorizontal } from "lucide-react";
import IconButton from "@/components/ui/Buttons/IconButton";
import { useChatComposer, type ChatComposerContext } from "@/hooks/useChatComposer";
import ChatComposerContextBar from "./ChatComposerContextBar";
import ChatAttachmentPreview from "./ChatAttachmentPreview";

interface ChatComposerProps {
  chatId: string;
  context?: ChatComposerContext;
  onCancel: () => void;
  onSend: (content: string, image: File | null) => Promise<void>;
  isPending: boolean;
  disabled: boolean;
}

const ChatComposer = (props: ChatComposerProps) => {
  const {
    content,
    attachment,
    inputRef,
    fileRef,
    isEditing,
    canSubmit,
    isDisabled,
    handleChange,
    handleKeyDown,
    handleFileChange,
    handleSubmit,
    stopTyping,
    openFilePicker,
    removeAttachment,
  } = useChatComposer(props);

  return (
    <form
      className="chat-composer"
      onSubmit={handleSubmit}
      aria-label={isEditing ? "Редактирование сообщения" : "Новое сообщение"}
    >
      {props.context && (
        <ChatComposerContextBar
          context={props.context}
          onCancel={props.onCancel}
          disabled={props.isPending}
        />
      )}
      {attachment && (
        <ChatAttachmentPreview
          url={attachment.url}
          fileName={attachment.file.name}
          onRemove={removeAttachment}
          disabled={props.isPending}
        />
      )}
      <div className="chat-composer__row">
        {!isEditing && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              hidden
              disabled={isDisabled}
              onChange={handleFileChange}
            />
            <IconButton
              type="button"
              aria-label="Прикрепить изображение"
              onClick={openFilePicker}
              disabled={isDisabled}
            >
              <ImagePlus size={22} />
            </IconButton>
          </>
        )}
        <textarea
          ref={inputRef}
          className="chat-composer__input"
          aria-label="Текст сообщения"
          placeholder="Сообщение…"
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={stopTyping}
          maxLength={700}
          rows={1}
          disabled={isDisabled}
        />
        <IconButton
          className="chat-composer__send"
          type="submit"
          aria-label={isEditing ? "Сохранить сообщение" : "Отправить сообщение"}
          disabled={!canSubmit}
        >
          {isEditing && props.isPending ? (
            <LoaderCircle className="animate-spin" size={20} />
          ) : isEditing ? (
            <Check size={21} />
          ) : (
            <SendHorizontal size={21} />
          )}
        </IconButton>
      </div>
      {content.length >= 600 && (
        <span className="chat-composer__counter">{content.length} / 700</span>
      )}
    </form>
  );
};

export default ChatComposer;
