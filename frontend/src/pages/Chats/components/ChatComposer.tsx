import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { Check, ImagePlus, LoaderCircle, Pencil, Reply, SendHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import IconButton from "@/components/ui/Buttons/IconButton";
import type { ChatMessageData } from "@/types/api.types";

export type ChatComposerContext = { type: "reply" | "edit"; message: ChatMessageData };

interface ChatComposerProps {
  context?: ChatComposerContext;
  onCancel: () => void;
  onSend: (content: string, image: File | null) => Promise<void>;
  isPending: boolean;
  disabled: boolean;
}

const ChatComposer = ({ context, onCancel, onSend, isPending, disabled }: ChatComposerProps) => {
  const [content, setContent] = useState(context?.type === "edit" ? context.message.content ?? "" : "");
  const [attachment, setAttachment] = useState<{ file: File; url: string } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);
  const isEditing = context?.type === "edit";
  const canSubmit = !disabled && (isEditing ? !!content.trim() : !!content.trim() || !!attachment);

  useEffect(() => {
    if (context) inputRef.current?.focus();
  }, [context]);

  useEffect(() => () => {
    if (attachment) URL.revokeObjectURL(attachment.url);
  }, [attachment]);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 132)}px`;
  }, [content]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || submitting.current) return;
    submitting.current = true;
    try {
      await onSend(content.trim(), attachment?.file ?? null);
      setContent("");
      setAttachment(null);
      inputRef.current?.focus();
    } catch {
      // Мутация показывает ошибку. Сохраняем черновик и вложение для повтора.
    } finally {
      submitting.current = false;
    }
  };

  return (
    <form className="chat-composer" onSubmit={handleSubmit} aria-label={isEditing ? "Редактирование сообщения" : "Новое сообщение"}>
      {context && <div className="chat-composer__context">
        {isEditing ? <Pencil size={18} /> : <Reply size={18} />}
        <div><strong>{isEditing ? "Редактирование" : `Ответ ${context.message.sender.name || context.message.sender.username}`}</strong><span>{context.message.content || "Изображение"}</span></div>
        <IconButton type="button" size="small" onClick={onCancel} disabled={isPending} aria-label="Отменить"><X size={18} /></IconButton>
      </div>}
      {attachment && <div className="chat-composer__attachment">
        <img src={attachment.url} alt="Прикреплённое изображение" />
        <span>{attachment.file.name}</span>
        <IconButton type="button" size="small" onClick={() => setAttachment(null)} disabled={isPending} aria-label="Убрать изображение"><X size={18} /></IconButton>
      </div>}
      <div className="chat-composer__row">
        {!isEditing && <>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" hidden disabled={disabled} onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
              toast.error("Выберите JPG, PNG, GIF или WebP");
              return;
            }
            if (file.size > 5 * 1024 * 1024) {
              toast.error("Изображение должно быть не больше 5 МБ");
              return;
            }
            setAttachment({ file, url: URL.createObjectURL(file) });
          }} />
          <IconButton type="button" aria-label="Прикрепить изображение" onClick={() => fileRef.current?.click()} disabled={disabled}><ImagePlus size={22} /></IconButton>
        </>}
        <textarea ref={inputRef} className="chat-composer__input" aria-label="Текст сообщения" placeholder="Сообщение…" value={content} onChange={(event) => setContent(event.target.value)} maxLength={700} rows={1} disabled={disabled} onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && window.matchMedia("(pointer: fine)").matches) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }} />
        <IconButton className="chat-composer__send" type="submit" aria-label={isEditing ? "Сохранить сообщение" : "Отправить сообщение"} disabled={!canSubmit}>
          {isPending ? <LoaderCircle className="animate-spin" size={20} /> : isEditing ? <Check size={21} /> : <SendHorizontal size={21} />}
        </IconButton>
      </div>
      {content.length >= 600 && <span className="chat-composer__counter">{content.length} / 700</span>}
    </form>
  );
};

export default ChatComposer;
