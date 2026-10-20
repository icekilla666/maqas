import InfiniteScroll, { type PaginationControl } from "@/components/common/InfiniteScroll";
import { Fragment, useCallback, useLayoutEffect, useRef } from "react";
import { MessageCircle, TriangleAlert } from "lucide-react";
import MessagesSkeleton from "@/components/common/Skeletons/MessagesSkeleton";
import EmptyState from "@/components/common/EmptyState";
import type { ChatMessageData } from "@/types/api.types";
import { normalizedDate } from "@/utils/normalizedDate";
import ChatMessageItem from "./ChatMessageItem";

interface ChatMessagesProps {
  messages: ChatMessageData[];
  pagination: PaginationControl;
  pendingMessageId?: string;
  isDeliveryUnconfirmed?: boolean;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRetry: () => void;
  scrollRequest: number;
  onReply: (message: ChatMessageData) => void;
  onEdit: (message: ChatMessageData) => void;
  onDelete: (message: ChatMessageData) => void;
  disabled: boolean;
}

const ChatMessages = ({
  messages,
  pagination,
  pendingMessageId,
  isDeliveryUnconfirmed = false,
  isLoading,
  isError,
  error,
  onRetry,
  scrollRequest,
  ...actions
}: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const anchor = useRef<{ id: string; top: number } | null>(null);
  const { fetchNextPage, isFetchingNextPage } = pagination;
  const loadOlder = useCallback(async () => {
    const element = scrollRef.current;
    if (element) {
      const top = element.getBoundingClientRect().top;
      const visible = Array.from(element.querySelectorAll<HTMLElement>("[data-message-id]"))
        .find(item => item.getBoundingClientRect().bottom > top);
      if (visible) anchor.current = { id: visible.dataset.messageId!, top: visible.getBoundingClientRect().top - top };
    }
    await fetchNextPage();
  }, [fetchNextPage]);
  const stickToBottom = useRef(true);
  const previousScrollRequest = useRef(scrollRequest);

  const scrollToBottom = () => {
    const element = scrollRef.current;
    if (element && stickToBottom.current)
      element.scrollTop = element.scrollHeight;
  };

  useLayoutEffect(() => {
    if (previousScrollRequest.current !== scrollRequest) {
      anchor.current = null;
      stickToBottom.current = true;
      previousScrollRequest.current = scrollRequest;
    }
    const element = scrollRef.current;
    if (anchor.current && element) {
      const item = Array.from(element.querySelectorAll<HTMLElement>("[data-message-id]"))
        .find(item => item.dataset.messageId === anchor.current?.id);
      if (item) element.scrollTop += item.getBoundingClientRect().top - element.getBoundingClientRect().top - anchor.current.top;
      if (!isFetchingNextPage) anchor.current = null;
    } else {
      scrollToBottom();
    }
  }, [messages, scrollRequest, isFetchingNextPage]);

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      if (stickToBottom.current) element.scrollTop = element.scrollHeight;
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="chat-messages"
      ref={scrollRef}
      role="region"
      aria-label="Сообщения"
      tabIndex={0}
      onScroll={() => {
        const element = scrollRef.current;
        if (element)
          stickToBottom.current =
            element.scrollHeight - element.scrollTop - element.clientHeight <
            80;
      }}
    >
      <InfiniteScroll pagination={pagination} enabled={!isLoading} onLoad={loadOlder} label="Предыдущие сообщения" />
      {isLoading && !messages.length && <MessagesSkeleton />}
      {!isLoading && isError && (
        <EmptyState
          icon={<TriangleAlert />}
          text="Не удалось загрузить сообщения"
          error={error}
          isError
          onRefetch={onRetry}
        />
      )}
      {!isLoading && !isError && !messages.length && (
        <div className="chat-messages__empty">
          <EmptyState
            icon={<MessageCircle size={32} />}
            text="Пока тихо. Напишите первым!"
          />
        </div>
      )}
      {messages.map((message, index) => {
        const date = normalizedDate({
          date: message.created_at,
          onlyDate: true,
          relativeToday: true,
        });
        const previous = messages[index - 1];
        const showDate =
          !previous ||
          normalizedDate({
            date: previous.created_at,
            onlyDate: true,
            relativeToday: true,
          }) !== date;
        return (
          <Fragment key={message.id}>
            {showDate && (
              <div className="chat-messages__date">
                <span>{date}</span>
              </div>
            )}
            <ChatMessageItem
              message={message}
              isSending={message.id === pendingMessageId}
              isDeliveryUnconfirmed={message.id === pendingMessageId && isDeliveryUnconfirmed}
              parent={messages.find(
                (parent) => parent.id === message.parent_id,
              )}
              onImageLoad={scrollToBottom}
              {...actions}
            />
          </Fragment>
        );
      })}
    </div>
  );
};

export default ChatMessages;
