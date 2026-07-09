import { useProfileStore } from "@/store/profile.store";
import AccountAvatar from "../Account/components/AccountAvatar";
import AccountInfo from "../Account/components/AccountInfo";
import TitlePage from "@/components/common/TitlePage";
import MainButton from "@/components/ui/Buttons/MainButton";
import ListButtons from "./components/ListButtons";
import ThemeSettings from "./components/ThemeSettings";
import { useNavigate } from "react-router-dom";
import { BLACKLIST_PAGE, EDIT_PAGE, FAQ_PAGE } from "@/utils/constants";

const SettingPage = () => {
  const profile = useProfileStore((s) => s.profile);
  const error = useProfileStore((state) => state.error);
  const navigate = useNavigate();
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
      children: "выйти из аккаунта",
      onClick: () => console.log("qwe"),
    },
    {
      children: "выйти со всех устройств",
      onClick: () => console.log("qwwqvfdfde"),
    },
    {
      children: "удаление аккаунта",
      className: "text-red",
      onClick: () => console.log("qwwqe"),
    },
  ];
  return (
    <section>
      <div className="container">
        <TitlePage title="Настройки" />
        {profile ? (
          <div className="mb-6 flex gap-3.5 items-center">
            <AccountAvatar
              username={profile.username}
              avatar={profile.avatar_url}
            />
            {/* лвл заглушка */}
            <AccountInfo
              name={profile.name}
              username={profile.username}
              lvl="лошок"
            />
          </div>
        ) : (
          <h1 className="text-red text-center">{error}</h1>
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
    </section>
  );
};

export default SettingPage;
