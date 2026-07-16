import TitlePage from "@/components/common/TitlePage";
import { useProfileStore } from "@/store/profile.store";
import Input from "@/components/ui/Inputs/Input";
import MainButton from "@/components/ui/Buttons/MainButton";
import { PenLine, TriangleAlert } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Avatar from "@/components/common/Avatar";
import EmptyState from "@/components/common/EmptyState";

const EditPage = () => {
  const profile = useProfileStore((s) => s.profile);
  const error = useProfileStore((s) => s.error);
  const isLoading = useProfileStore((s) => s.isLoading);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const uploadAvatar = useProfileStore((s) => s.uploadAvatar);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    bio: "",
  });

  useEffect(() => {
    if (!profile) return;

    setFormData({
      username: profile.username,
      name: profile.name,
      bio: profile.bio ?? "",
    });
  }, [profile]);

  const updateField = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateProfile(formData);
    } catch (submitError) {
      console.error(submitError);
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatar(file);
    } catch (avatarError) {
      console.error(avatarError);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <section>
      <div className="container">
        <TitlePage title="Редактирование профиля" />
        <div className="flex flex-col items-center gap-7">
          {profile ? (
            <>
              <div className="relative">
                <Avatar
                  avatar={profile.avatar_url}
                  username={profile.username}
                  width={128}
                  size={64}
                />
                <label className="avatar_egit-btn" aria-label="изменить аватар">
                  <input
                    accept="image/*"
                    className="avatar_egit-input"
                    disabled={isLoading}
                    onChange={handleAvatarChange}
                    type="file"
                  />
                  <PenLine size={18} />
                </label>
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
            </>
          ) : (
            <EmptyState
              icon={<TriangleAlert />}
              text={error ?? "Не удалось загрузить профиль"}
              variant="error"
            />
          )}
          <MainButton
            disabled={!profile || isLoading}
            type="submit"
            form="edit-form"
            typesBtn="primary"
            align="center"
          >
            {isLoading ? "Сохранение..." : "Сохранить"}
          </MainButton>
        </div>
      </div>
    </section>
  );
};

export default EditPage;
