import { useEffect, useId, useRef, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import SearchInput from "@/components/ui/Inputs/SearchInput";
import IconButton from "@/components/ui/Buttons/IconButton";
import Loader from "@/components/ui/Loaders/Loader";
import ChatsSkeleton from "@/components/common/Skeletons/ChatsSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useCreateChatMutation } from "@/lib/chatsQueries";
import { useUsersFindQuery } from "@/lib/usersQueries";
import type { ChatData } from "@/types/api.types";
import { CHAT_DETAIL } from "@/utils/constants";
import ChatList from "./ChatList";
import ChatUserInfo from "./ChatUserInfo";

const ChatSearch = ({ chats }: { chats: ChatData[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const navigate = useNavigate();
  const createChat = useCreateChatMutation();
  const query = search.trim().replace(/^@/, "").toLowerCase();
  const debouncedQuery = useDebounce(query, 400);
  const canSearch = isOpen && !!query && query === debouncedQuery;
  const users = useUsersFindQuery(canSearch ? debouncedQuery : "", 1);

  const filteredChats = chats.filter(({ target_user }) =>
    `${target_user.name} ${target_user.username}`.toLowerCase().includes(query),
  );
  const chatUserIds = new Set(chats.map((chat) => chat.target_user.id));
  const globalUsers = canSearch && !users.isError
    ? (users.data ?? []).filter((user) => !chatUserIds.has(user.id))
    : [];
  const isSearching = isOpen && !!query && (query !== debouncedQuery || users.isLoading);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div
      ref={wrapperRef}
      className={`chat-search ${isOpen ? "chat-search--open" : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          wrapperRef.current?.querySelector("input")?.focus();
          setIsOpen(false);
        }
      }}
      onBlur={(event) => {
        // На iOS тап по результату может вызвать blur с relatedTarget === null
        // до click. Закрытие здесь скрыло бы результат раньше нажатия.
        // Нажатия снаружи отдельно обрабатывает handleOutsideClick.
        if (
          event.relatedTarget instanceof Node &&
          !event.currentTarget.contains(event.relatedTarget)
        ) setIsOpen(false);
      }}
    >
      <div className="chat-search__toolbar">
        <SearchInput
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          placeholder="Найти чат или пользователя"
          aria-label="Поиск чатов и пользователей"
          aria-expanded={isOpen}
          aria-controls={panelId}
          type="search"
        />
        {isOpen && (
          <IconButton
            type="button"
            size="small"
            aria-label="Закрыть поиск"
            onClick={() => {
              wrapperRef.current?.querySelector("input")?.focus();
              setIsOpen(false);
            }}
          >
            <X size={20} />
          </IconButton>
        )}
      </div>
      <div
        id={panelId}
        className="chat-search__panel"
        role="region"
        aria-label="Результаты поиска"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <section aria-labelledby={`${panelId}-chats`}>
          <h2 id={`${panelId}-chats`} className="chat-search__heading">Мои чаты</h2>
          <ChatList chats={filteredChats} />
        </section>
        <section aria-labelledby={`${panelId}-global`} aria-busy={isSearching}>
          <h2 id={`${panelId}-global`} className="chat-search__heading">
            Глобальные
          </h2>
          {isSearching && <ChatsSkeleton count={3} label="Поиск пользователей…" />}
          <ul className="chat-list">
            {globalUsers.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  className="chat-list__item"
                  disabled={createChat.isPending}
                  onClick={() => createChat.mutate(user.id, {
                    onSuccess: (chat) => navigate(generatePath(CHAT_DETAIL, { chat_id: chat.id }), { state: { user } }),
                  })}
                >
                  <ChatUserInfo user={user} />
                  {createChat.isPending && createChat.variables === user.id && (
                    <span role="status" aria-label="Открываем чат"><Loader width={18} /></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ChatSearch;
