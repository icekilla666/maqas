import EmptyState from "@/components/common/EmptyState";
import TitlePage from "@/components/common/TitlePage";
import SearchInput from "@/components/ui/Inputs/SearchInput";
import Loader from "@/components/ui/Loader";
import ModalActions from "@/components/ui/Modals/ModalActions";
import { usersApi } from "@/services/users.api";
import type { BlackListUserData } from "@/types/entities";
import { Ban, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import UsersList from "@/components/common/UsersList";
import { useBlackList } from "@/hooks/useBlackList";

const BlackListPage = () => {
  const { handleUnblock } = useBlackList();
  const [users, setUsers] = useState<BlackListUserData[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<BlackListUserData | null>(
    null,
  );

  useEffect(() => {
    const fetchBlackList = async () => {
      try {
        const data = await usersApi.getBlackList({ skip: 0, limit: 20 });
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBlackList();
  }, []);

  const openUnblockModal = (id: string) => {
    if (!users) return;
    const user = users.find((user) => user.id === id);
    if (user) setSelectedUser(user);
  };

  const handleUnblockConfirm = async () => {
    if (!selectedUser) return;

    try {
      handleUnblock(selectedUser.id);
      setUsers((prev) =>
        prev ? prev.filter((user) => user.id !== selectedUser.id) : prev,
      );
      setSelectedUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  if (!users) return <Loader />; // скелет
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
          onConfirm={() => void handleUnblockConfirm()}
        />
      )}
    </section>
  );
};

export default BlackListPage;
