import EmptyState from "@/components/common/EmptyState";
import TitlePage from "@/components/common/TitlePage";
import SearchInput from "@/components/ui/Inputs/SearchInput";
import Loader from "@/components/ui/Loaders/Loader";
import ModalActions from "@/components/ui/Modals/ModalActions";
import { Ban, CircleX } from "lucide-react";
import { useState } from "react";
import UsersList from "@/components/common/UsersList";
import { useBlackListQuery, useUnblockUserMutation } from "@/lib/usersQueries";
import type { BlackListUserData } from "@/types/api.types";

const BlackListPage = () => {
  const { data: users = [], isLoading, isFetching } = useBlackListQuery();
  const unblockMutation = useUnblockUserMutation();
  const [selectedUser, setSelectedUser] = useState<BlackListUserData | null>(
    null,
  );

  const openUnblockModal = (id: string) => {
    const user = users.find((user: BlackListUserData) => user.id === id);
    if (user) setSelectedUser(user);
  };

  const confirmUnblock = () => {
    if (!selectedUser) return;

    unblockMutation.mutate(selectedUser.id, {
      onSuccess: () => setSelectedUser(null),
    });
  };

  if (isLoading || isFetching) return <Loader />; // скелет

  return (
    <section>
      <div className="container">
        <TitlePage title="Черный список" count={users.length} />
        <SearchInput className="w-full mb-3" placeholder="введите юзернейм" />
        <UsersList
          className="blacklist-item"
          users={users}
          button={
            <CircleX
              size={24}
              color="var(--color-red)"
              style={{ strokeWidth: "1.5px" }}
            />
          }
          onBtnClick={openUnblockModal}
        />
        <p className="text-[14px] mt-5 opacity-40">
          Заблокированные пользователи не смогут писать вам, просматривать ваш
          профиль и оставлять вам комментарии. Вы не будете видеть их посты в
          ленте рекомендаций.
        </p>
        {!users.length && (
          <EmptyState
            icon={<Ban />}
            text="Черный список пуст. Здесь будут аккаунты, которые ты заблокируешь"
          />
        )}
      </div>
      {selectedUser && (
        <ModalActions
          open={Boolean(selectedUser)}
          text={`Вы уверены что хотите убрать ${selectedUser.username} из черного списка?`}
          cancelText="Отмена"
          confirmText="Да"
          onCancel={() => setSelectedUser(null)}
          onConfirm={confirmUnblock}
        />
      )}
    </section>
  );
};

export default BlackListPage;
