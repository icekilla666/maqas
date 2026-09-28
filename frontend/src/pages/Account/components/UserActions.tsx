import MainButton from "@/components/ui/Buttons/MainButton";
import { useCreateChatMutation } from "@/lib/chatsQueries";
import type { UserData } from "@/types/api.types";
import { MessageCircle, UserRoundPlus, UserRoundX } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserActionsProps {
  profile: UserData;
  onFollow: () => void;
  isFollowDisabled?: boolean;
}

const UserActions = ({
  profile,
  onFollow,
  isFollowDisabled,
}: UserActionsProps) => {
  const navigate = useNavigate();
  const createChat = useCreateChatMutation();
  const handleChat = () => {
    createChat.mutate(profile.id);
    navigate(`/chats/`);
  };
  return (
    <div className="flex w-full gap-2.5">
      <MainButton
        onClick={handleChat}
        icon={<MessageCircle />}
        size="small"
        align="center"
      >
        Сообщения
      </MainButton>
      <MainButton
        disabled={isFollowDisabled}
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
