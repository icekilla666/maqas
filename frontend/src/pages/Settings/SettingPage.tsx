import { useProfileStore } from "@/store/profile.store";
import AccountAvatar from "../Account/components/AccountAvatar";
import AccountInfo from "../Account/components/AccountInfo";
import TitlePage from "@/components/common/TitlePage";
import MainButton from "@/components/ui/Buttons/MainButton";
import ListButtons from "./components/ListButtons";
import ThemeSettings from "./components/ThemeSettings";

const SettingPage = () => {
  const profile = useProfileStore((s) => s.profile);
  const error = useProfileStore((state) => state.error);
  const actionBtns = [
    {
      children: "часто задаваемые вопросы",
      onClick: () => console.log("qwe"),
    },
    {
      children: "посмотреть черный список",
      onClick: () => console.log("qwwqe"),
    },
    {
      children: "выйти со всех устройств",
      onClick: () => console.log("qwwqvfdfde"),
    },
  ];
  const exitBtns = [
    {
      children: "выйти из аккаунта",
      onClick: () => console.log("qwe"),
    },
    {
      children: "удаление аккаунта",
      onClick: () => console.log("qwwqe"),
    },
  ];
  return (
    <section>
      <div className="container">
        <TitlePage title="настройки" />
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
          <MainButton onClick={() => console.log("wqe")}>
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
