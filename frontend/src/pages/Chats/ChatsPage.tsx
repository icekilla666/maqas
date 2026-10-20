import InfiniteScroll from "@/components/common/InfiniteScroll";
import { MessageCircle, TriangleAlert } from "lucide-react";
import TitlePage from "@/components/common/TitlePage";
import EmptyState from "@/components/common/EmptyState";
import { useMyChatsQuery } from "@/lib/chatsQueries";
import ChatList from "./components/ChatList";

import ChatsSkeleton from "@/components/common/Skeletons/ChatsSkeleton";
import ChatSearch from "./components/ChatSearch";

const ChatsPage = () => {
  const chatsQuery = useMyChatsQuery();
  const { data: chats, isPending, isError, error, refetch } = chatsQuery;
  const visibleChats = (chats ?? []).filter((chat) => !!chat.last_message);
  return (
    <section className="wrapper chats-page">
      <div className="container chats-page__container">
        <TitlePage title="Чаты" />
        <ChatSearch chats={visibleChats} pagination={chatsQuery} />
        {isError && (
          <EmptyState
            icon={<TriangleAlert />}
            text="Не удалось загрузить чаты"
            error={error}
            isError={isError}
            onRefetch={() => void refetch()}
          />
        )}
        {isPending && <ChatsSkeleton />}

        {!isPending && !isError &&
          (visibleChats.length ? (
            <ChatList chats={visibleChats} />
          ) : (
            <div className="chats-page__empty">
              <EmptyState
                icon={<MessageCircle />}
                text={"Здесь будут ваши переписки"}
              />
            </div>
          ))}
        <InfiniteScroll pagination={chatsQuery} />
      </div>
    </section>
  );
};

export default ChatsPage;
