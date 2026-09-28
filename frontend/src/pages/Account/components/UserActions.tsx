import MainButton from "@/components/ui/Buttons/MainButton";
import { useCreateChatMutation } from "@/lib/chatsQueries";
import type { UserData } from "@/types/api.types";
import { CHAT_DETAIL } from "@/utils/constants";
import { MessageCircle, UserRoundPlus, UserRoundX } from "lucide-react";
import { generatePath, useNavigate } from "react-router-dom";

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
    if (createChat.isPending) return;

    createChat.mutate(profile.id, {
      onSuccess: (chat) => {
        navigate(generatePath(CHAT_DETAIL, { chat_id: chat.id }), {
          state: { user: profile },
        });
      },
    });
  };
  
  return (
    <div className="flex w-full gap-2.5">
      <MainButton
        type="button"
        onClick={handleChat}
        disabled={createChat.isPending}
        aria-busy={createChat.isPending}
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
