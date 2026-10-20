import { validateImage } from "@/utils/validateImage";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { toast } from "sonner";
import type { ChatMessageData } from "@/types/api.types";
import { useChatTyping } from "./useChatTyping";

export type ChatComposerContext = {
  type: "reply" | "edit";
  message: ChatMessageData;
};

interface UseChatComposerOptions {
  chatId: string;
  context?: ChatComposerContext;
  onSend: (content: string, image: File | null) => Promise<void>;
  isPending: boolean;
  disabled: boolean;
}

export const useChatComposer = ({
  chatId,
  context,
  onSend,
  isPending,
  disabled,
}: UseChatComposerOptions) => {
  const [content, setContent] = useState(
    context?.type === "edit" ? (context.message.content ?? "") : "",
  );
  const [attachment, setAttachment] = useState<{
    file: File;
    url: string;
  } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);
  const isEditing = context?.type === "edit";
  const canSubmit =
    !disabled &&
    !isPending &&
    (isEditing ? !!content.trim() : !!content.trim() || !!attachment);
  const { handleTyping, stopTyping } = useChatTyping(chatId);

  useEffect(() => {
    if (context) inputRef.current?.focus();
  }, [context]);

  useEffect(
    () => () => {
      if (attachment) URL.revokeObjectURL(attachment.url);
    },
    [attachment],
  );

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "auto";
    // scrollHeight включает padding, но не границы border-box.
    const styles = getComputedStyle(input);
    const borderHeight = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
    input.style.height = `${Math.min(input.scrollHeight + borderHeight, 132)}px`;
  }, [content]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || submitting.current) return;
    stopTyping();
    submitting.current = true;
    const draft = content;
    const image = attachment?.file ?? null;
    if (!isEditing) {
      setContent("");
      setAttachment(null);
    }
    try {
      await onSend(draft.trim(), image);
      // Новый черновик, введённый во время отправки, сохраняем.
      if (isEditing) setContent("");
    } catch {
      if (!isEditing) {
        setContent(current => current ? `${draft}\n${current}` : draft);
        if (image)
          setAttachment({ file: image, url: URL.createObjectURL(image) });
      }
    } finally {
      submitting.current = false;
    }
  };

  useEffect(() => {
    if (disabled || isPending || isEditing) stopTyping();
  }, [disabled, isPending, isEditing, stopTyping]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setContent(value);
    if (!isEditing && !disabled && !isPending) handleTyping(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing &&
      window.matchMedia("(pointer: fine)").matches
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const imageError = validateImage(file);
    if (imageError) { toast.error(imageError); return; }
    setAttachment({ file, url: URL.createObjectURL(file) });
  };

  return {
    content,
    attachment,
    inputRef,
    fileRef,
    isEditing,
    canSubmit,
    isDisabled: disabled || isPending,
    handleChange,
    handleKeyDown,
    handleFileChange,
    handleSubmit,
    stopTyping,
    openFilePicker: () => fileRef.current?.click(),
    removeAttachment: () => setAttachment(null),
  };
};
