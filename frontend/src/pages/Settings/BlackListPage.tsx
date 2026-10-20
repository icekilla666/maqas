import InfiniteScroll from "@/components/common/InfiniteScroll";
import EmptyState from "@/components/common/EmptyState";
import TitlePage from "@/components/common/TitlePage";
import UsersSkeleton from "@/components/common/Skeletons/UsersSkeleton";
import ModalActions from "@/components/ui/Modals/ModalActions";
import { Ban, CircleX, TriangleAlert } from "lucide-react";
import { useState } from "react";
import UsersList from "@/components/common/UsersList/UsersList";
import {
  useBlackListQuery,
  useMeQuery,
  useUnblockUserMutation,
} from "@/lib/usersQueries";
import type { BlackListUserData } from "@/types/api.types";

const BlackListPage = () => {
  const usersQuery = useBlackListQuery();
  const { data: users = [], isLoading, isError, error, refetch } = usersQuery;
  const { data: profile } = useMeQuery();
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


  return (
    <section className="wrapper">
      <div className="container">
        <TitlePage title="Черный список" count={isLoading ? undefined : usersQuery.total ?? users.length} />
        {isLoading ? <UsersSkeleton action /> : <UsersList
          className="blacklist-item"
          users={users}
          userId={profile?.id}
          button={
            <CircleX
              size={24}
              color="var(--color-red)"
              style={{ strokeWidth: "1.5px" }}
            />
          }
          onBtnClick={openUnblockModal}
        />}
        <InfiniteScroll pagination={usersQuery} />
        <p className="text-[14px] mt-5 opacity-40">
          Заблокированные пользователи не смогут писать вам, просматривать ваш
          профиль и оставлять вам комментарии. Вы не будете видеть их посты в
          ленте рекомендаций.
        </p>
        {isError && (
          <EmptyState icon={<TriangleAlert />} text="Не удалось загрузить чёрный список" error={error} isError onRefetch={() => void refetch()} />
        )}
        {!isLoading && !isError && !users.length && (
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
