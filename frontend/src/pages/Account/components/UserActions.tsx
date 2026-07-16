import MainButton from "@/components/ui/Buttons/MainButton";
import type { UserData } from "@/types/entities";
import { MessageCircle, UserRoundPlus, UserRoundX } from "lucide-react";

interface UserActionsProps {
  profile: UserData;
  onFollow: () => Promise<void>;
}

const UserActions = ({ profile, onFollow }: UserActionsProps) => {
  return (
    <div className="flex w-full gap-2.5 mt-6">
      <MainButton
        onClick={() => console.log("chat")}
        icon={<MessageCircle />}
        size="small"
        align="center"
      >
        Сообщения
      </MainButton>
      <MainButton
        className="follow-button"
        onClick={onFollow}
        icon={!profile.is_following ? <UserRoundPlus /> : <UserRoundX />}
        size="small"
        align="center"
        typesBtn={!profile.is_following ? "primary" : "default"}
      >
        {!profile.is_following ? "Подписаться" : "Отписаться"}
      </MainButton>
    </div>
  );
};

export default UserActions;
