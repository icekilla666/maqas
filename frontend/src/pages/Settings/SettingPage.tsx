import AccountInfo from "../Account/components/AccountInfo";
import TitlePage from "@/components/common/TitlePage";
import MainButton from "@/components/ui/Buttons/MainButton";
import ListButtons from "./components/ListButtons";
import ThemeSettings from "./components/ThemeSettings";
import { useNavigate } from "react-router-dom";
import { BLACKLIST_PAGE, EDIT_PAGE, FAQ_PAGE } from "@/utils/constants";
import { useExists } from "@/hooks/useExists";
import { useState } from "react";
import ModalActions from "@/components/ui/Modals/ModalActions";
import Avatar from "@/components/common/Avatar";
import EmptyState from "@/components/common/EmptyState";
import { TriangleAlert } from "lucide-react";
import { useMeQuery } from "@/lib/usersQueries";
import LoaderBackdrop from "@/components/ui/Loaders/LoaderBackdrop";

type ExitAction = "logout" | "logoutAll" | "delete" | null;

const SettingPage = () => {
  const { data: profile } = useMeQuery();
  const navigate = useNavigate();
  const { handleLogout, handleLogoutAll, handleDelete, isPending } =
    useExists();
  const [modal, setModal] = useState<ExitAction>(null);
  const modalConfig = {
    logout: {
      text: "Вы уверены что хотите выйти из аккаунта?",
      confirmText: "Выйти",
      infoText: undefined,
      onConfirm: handleLogout,
    },
    logoutAll: {
      text: "Вы уверены что хотите выйти со всех устройств?",
      confirmText: "Выйти",
      infoText: undefined,
      onConfirm: handleLogoutAll,
    },
    delete: {
      text: "Вы уверены что хотите удалить аккаунт?",
      confirmText: "Удалить",
      infoText:
        "Если вы удалите свой аккаунт, то потеряете все что с ним связано. Вы не сможете после этого зайти или восстановить его!",
      onConfirm: handleDelete,
    },
  } satisfies Record<
    Exclude<ExitAction, null>,
    {
      text: string;
      confirmText: string;
      infoText?: string;
      onConfirm: () => void;
    }
  >;

  const actionBtns = [
    {
      children: "часто задаваемые вопросы",
      onClick: () => navigate(FAQ_PAGE),
    },
    {
      children: "посмотреть черный список",
      onClick: () => navigate(BLACKLIST_PAGE),
    },
  ];
  const exitBtns = [
    {
      children: "удаление аккаунта",
      className: "text-red",
      onClick: () => setModal("delete"),
    },
    {
      children: "выйти со всех устройств",
      onClick: () => setModal("logoutAll"),
    },
    {
      children: "выйти из аккаунта",
      onClick: () => setModal("logout"),
    },
  ];

  const activeModal = modal ? modalConfig[modal] : null;
  return (
    <section>
      <div className="container">
        <TitlePage title="Настройки" />
        {profile ? (
          <div className="mb-6 flex gap-3.5 items-center">
            <Avatar username={profile.username} avatar={profile.avatar_url} />
            <AccountInfo
              name={profile.name}
              username={profile.username}
              lvl={profile.level}
            />
          </div>
        ) : (
          <EmptyState
            icon={<TriangleAlert />}
            text={"Не удалось загрузить профиль"}
            variant="error"
          />
        )}
        <div className="flex flex-col gap-3">
          <MainButton onClick={() => navigate(EDIT_PAGE)}>
            редактировать профиль
          </MainButton>
          <ListButtons btns={actionBtns} />
          <ThemeSettings />
          <ListButtons btns={exitBtns} />
        </div>
      </div>
      {activeModal && (
        <ModalActions
          open={Boolean(activeModal)}
          text={activeModal.text}
          cancelText="Отмена"
          confirmText={activeModal.confirmText}
          onCancel={() => setModal(null)}
          onConfirm={() => {
            activeModal.onConfirm();
            setModal(null);
          }}
          infoText={activeModal.infoText}
        />
      )}
      <LoaderBackdrop open={isPending} />
    </section>
  );
};

export default SettingPage;
