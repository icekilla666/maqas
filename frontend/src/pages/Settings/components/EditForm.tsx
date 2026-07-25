import Avatar from "@/components/common/Avatar/Avatar";
import Input from "@/components/ui/Inputs/Input";
import StrokeButton from "@/components/ui/Buttons/StrokeButton";
import {
  useDeleteAvatarMutation,
  useUpdateMeMutation,
  useUploadAvatarMutation,
} from "@/lib/usersQueries";
import type { AccountData } from "@/types/api.types";
import { ImagePlus, PenLine, Trash2 } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import MainButton from "@/components/ui/Buttons/MainButton";
import Modal from "@/components/ui/Modals/Modal";

const EditForm = ({ profile }: { profile: AccountData }) => {
  const updateProfile = useUpdateMeMutation();
  const uploadAvatar = useUploadAvatarMutation();
  const deleteAvatar = useDeleteAvatarMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: profile.username,
    name: profile.name,
    bio: profile.bio ?? "",
  });
  const isLoading =
    updateProfile.isPending || uploadAvatar.isPending || deleteAvatar.isPending;

  const updateField = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile.mutate(formData);
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    uploadAvatar.mutate(file, {
      onSettled: () => {
        event.target.value = "";
      },
    });
  };

  const openFilePicker = () => {
    setIsAvatarModalOpen(false);
    fileInputRef.current?.click();
  };

  const handleEditAvatarClick = () => {
    if (profile.avatar_url) {
      setIsAvatarModalOpen(true);
      return;
    }

    openFilePicker();
  };

  const handleDeleteAvatar = () => {
    deleteAvatar.mutate(undefined, {
      onSuccess: () => setIsAvatarModalOpen(false),
    });
  };

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="relative">
        <Avatar
          avatar={profile.avatar_url}
          username={profile.username}
          width={128}
          size={64}
        />
        <input
          accept="image/*"
          className="avatar_egit-input"
          disabled={isLoading}
          onChange={handleAvatarChange}
          ref={fileInputRef}
          type="file"
        />
        <button
          className="avatar_egit-btn"
          aria-label="изменить аватар"
          disabled={isLoading}
          onClick={handleEditAvatarClick}
          type="button"
        >
          <PenLine size={18} />
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col mb-16 gap-2 w-full"
        id="edit-form"
      >
        <Input
          disabled={isLoading}
          maxLength={20}
          name="username"
          label="username"
          onChange={updateField("username")}
          required
          value={formData.username}
        />
        <Input
          disabled={isLoading}
          maxLength={50}
          name="name"
          label="имя"
          onChange={updateField("name")}
          required
          value={formData.name}
        />
        <Input
          disabled={isLoading}
          maxLength={170}
          name="bio"
          label="статус"
          onChange={updateField("bio")}
          value={formData.bio}
        />
      </form>

      <MainButton
        disabled={!profile || isLoading}
        type="submit"
        form="edit-form"
        typesBtn="primary"
        align="center"
      >
        {isLoading ? "Сохранение..." : "Сохранить"}
      </MainButton>
      <Modal
        open={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        className="modal--avatar-actions"
      >
        <div className="avatar-actions">
          <StrokeButton
            className="avatar-actions__button text-red"
            disabled={deleteAvatar.isPending}
            icon={<Trash2 size={20} />}
            onClick={handleDeleteAvatar}
            type="button"
          >
            удалить аватар
          </StrokeButton>
          <StrokeButton
            className="avatar-actions__button"
            disabled={uploadAvatar.isPending}
            icon={<ImagePlus size={20} />}
            onClick={openFilePicker}
            type="button"
          >
            добавить аватар
          </StrokeButton>
        </div>
      </Modal>
    </div>
  );
};

export default EditForm;
