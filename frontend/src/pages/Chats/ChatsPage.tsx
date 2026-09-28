import { MessageCircle, TriangleAlert } from "lucide-react";
import TitlePage from "@/components/common/TitlePage";
import EmptyState from "@/components/common/EmptyState";
import { useMyChatsQuery } from "@/lib/chatsQueries";
import ChatList from "./components/ChatList";

import Loader from "@/components/ui/Loaders/Loader";
import ChatSearch from "./components/ChatSearch";

const ChatsPage = () => {
  const { data: chats, isPending, isError, error, refetch } = useMyChatsQuery();
  return (
    <section className="wrapper chats-page">
      <div className="container chats-page__container">
        <TitlePage title="Чаты" />
        <ChatSearch chats={chats ?? []} />
        {isError && (
          <EmptyState
            icon={<TriangleAlert />}
            text="Не удалось загрузить чаты"
            error={error}
            isError={isError}
            onRefetch={() => void refetch()}
          />
        )}
        {/* скелет */}
        {isPending && <Loader />}

        {chats &&
          (chats.length ? (
            <ChatList chats={chats} />
          ) : (
            <div className="chats-page__empty">
              <EmptyState
                icon={<MessageCircle />}
                text={"Здесь будут ваши переписки"}
              />
            </div>
          ))}
      </div>
    </section>
  );
};

export default ChatsPage;
