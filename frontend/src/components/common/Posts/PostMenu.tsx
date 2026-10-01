import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import ItemMenu from "../ItemMenu";
import ModalActions from "@/components/ui/Modals/ModalActions";
import { useMeQuery } from "@/lib/usersQueries";
import { useDeletePostMutation } from "@/lib/postsQueries";

interface PostMenuProps {
  postId: string;
  authorId: string;
  onDeleted?: () => void;
}

const PostMenu = ({ postId, authorId, onDeleted }: PostMenuProps) => {
  const { data: me } = useMeQuery();
  const deletePost = useDeletePostMutation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deletingRef = useRef(false);
  const isOwnPost = me?.id === authorId;

  const handleDelete = async () => {
    if (!isOwnPost || deletingRef.current) return;
    deletingRef.current = true;
    try {
      await deletePost.mutateAsync({ postId, authorId });
      setIsDeleteOpen(false);
      onDeleted?.();
    } finally {
      deletingRef.current = false;
    }
  };

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <ItemMenu
        reportTarget="post"
        ariaLabel="Меню поста"
        actions={
          isOwnPost
            ? [
                {
                  text: "Удалить пост",
                  icon: <Trash2 size={17} />,
                  className: "text-red",
                  disabled: deletePost.isPending,
                  onClick: () => setIsDeleteOpen(true),
                },
              ]
            : []
        }
      />
      {isOwnPost && isDeleteOpen && (
        <ModalActions
          open
          text="Удалить пост? Это действие нельзя отменить."
          confirmText={deletePost.isPending ? "Удаление…" : "Удалить"}
          cancelText="Отмена"
          isPending={deletePost.isPending}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}
    </div>
  );
};

export default PostMenu;
