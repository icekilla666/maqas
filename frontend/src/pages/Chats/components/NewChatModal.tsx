import { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { Search, TriangleAlert, X } from "lucide-react";
import Modal from "@/components/ui/Modals/Modal";
import IconButton from "@/components/ui/Buttons/IconButton";
import SearchInput from "@/components/ui/Inputs/SearchInput";
import EmptyState from "@/components/common/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { useMeQuery, useUsersFindQuery } from "@/lib/usersQueries";
import { useCreateChatMutation } from "@/lib/chatsQueries";
import { CHAT_DETAIL } from "@/utils/constants";
import ChatUserInfo from "./ChatUserInfo";
import ChatsSkeleton from "@/components/common/Skeletons/ChatsSkeleton";

const NewChatModal = ({ onClose }: { onClose: () => void }) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 350);
  const users = useUsersFindQuery(debouncedSearch);
  const profile = useMeQuery();
  const me = profile.data;
  const createChat = useCreateChatMutation();
  const navigate = useNavigate();
  const results = (users.data ?? []).filter((user) => user.id !== me?.id);
  const isSearching = search.trim() !== debouncedSearch || users.isLoading;

  return (
    <Modal open onClose={() => { if (!createChat.isPending) onClose(); }} className="new-chat-modal" ariaLabel="Новый чат">
      <header className="chats-page__header">
        <h2>Новый чат</h2>
        <IconButton type="button" size="small" aria-label="Закрыть" onClick={onClose} disabled={createChat.isPending}><X size={20} /></IconButton>
      </header>
      <SearchInput autoFocus type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Введите юзернейм" aria-label="Найти пользователя" disabled={createChat.isPending} />
      {profile.isError && <EmptyState icon={<TriangleAlert />} text="Не удалось загрузить профиль" error={profile.error} isError onRefetch={() => void profile.refetch()} />}
      <div className="new-chat-modal__results" aria-busy={createChat.isPending}>
        {search.trim().length < 2 ? (
          <EmptyState icon={<Search />} text="Введите хотя бы 2 символа юзернейма" />
        ) : (
          <>
            {isSearching && <ChatsSkeleton count={3} label="Поиск пользователей…" />}
            {!isSearching && users.isError && <EmptyState icon={<TriangleAlert />} text="Не удалось загрузить пользователей" error={users.error} isError onRefetch={() => void users.refetch()} />}
            {!isSearching && !users.isError && (results.length ? (
              <ul className="chat-list">
                {results.map((user) => (
                  <li key={user.id}>
                    <button type="button" className="chat-list__item" disabled={createChat.isPending || !me} onClick={() => createChat.mutate(user.id, {
                      onSuccess: (chat) => {
                        onClose();
                        navigate(generatePath(CHAT_DETAIL, { chat_id: chat.id }), { state: { user } });
                      },
                    })}>
                      <ChatUserInfo user={user} />
                      {createChat.isPending && createChat.variables === user.id && <span className="chat-muted">Открываем…</span>}
                    </button>
                  </li>
                ))}
              </ul>
            ) : <EmptyState icon={<Search />} text="Никого не нашли" />)}
          </>
        )}
      </div>
    </Modal>
  );
};

export default NewChatModal;
