import MainInput from "@/components/ui/Inputs/MainInput";
import Textarea from "@/components/ui/Inputs/Textarea";
import { POST_TAGS } from "@/utils/constants";
import { Check, Hash, ImagePlus, Trash2 } from "lucide-react";
import AddPostEditorHeader from "./AddPostEditorHeader";
import {
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import type { AddPostProps, PostTag } from "@/types/api.types";
import IconButton from "@/components/ui/Buttons/IconButton";
import { addPostSchema } from "@/utils/validation/validation.add";
import { useDraftStore } from "@/store/draft.store";

interface AddPostEditorProps {
  formData: AddPostProps;
  setFormData: Dispatch<SetStateAction<AddPostProps>>;
}

const AddPostEditor = ({ formData, setFormData }: AddPostEditorProps) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const { resetDraft } = useDraftStore();

  const updateField = (field: keyof typeof formData) => (value: string) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleTag = (tag: PostTag) => {
    setFormData((prev) => {
      if (prev.tags.includes(tag)) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tag) };
      }

      if (prev.tags.length >= 5) {
        return prev;
      }

      return { ...prev, tags: [...prev.tags, tag] };
    });
  };

  const addImage = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return URL.createObjectURL(file);
    });
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreview(null);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = addPostSchema.safeParse(formData);
    if (!result.success) return setError(result.error?.issues[0].message);

    setError("");
    setFormData({
      title: "",
      content: "",
      tags: [],
      hashtags: "",
      image: null,
    });
    resetDraft();
  };

  return (
    <div className="add-post-editor">
      <AddPostEditorHeader />
      <form
        onSubmit={handleSubmit}
        id="add-post-form"
        className="add-post-fields"
      >
        <label className="add-post-field">
          <span className="add-post-field__label">Заголовок</span>
          <MainInput
            className="add-post-field__input"
            maxLength={120}
            name="title"
            placeholder="О чём ваша публикация?"
            value={formData.title}
            onChange={(e) => updateField("title")(e.target.value)}
            hint={`${formData.title.length}/120`}
            error={
              formData.title.length == 120
                ? `${formData.title.length}/120`
                : undefined
            }
          />
        </label>

        <Textarea
          className="add-post-content"
          hint={`${formData.content.length}/2500`}
          error={
            formData.content.length == 2500
              ? `${formData.content.length}/2500`
              : undefined
          }
          label="Текст публикации"
          maxLength={2500}
          name="content"
          placeholder="Поделитесь историей, идеей или полезным опытом..."
          rows={9}
          value={formData.content}
          onChange={(e) => updateField("content")(e.target.value)}
        />

        <fieldset className="add-post-field add-post-tags">
          <legend className="add-post-field__label">Темы</legend>
          <p className="add-post-field__description">
            Выберите до пяти тем, чтобы публикацию было проще найти
          </p>
          <div className="add-post-tags__list">
            {POST_TAGS.map((tag) => (
              <label className="add-post-tag" key={tag}>
                <input
                  name="tags"
                  type="checkbox"
                  value={tag}
                  checked={formData.tags.includes(tag)}
                  disabled={
                    !formData.tags.includes(tag) && formData.tags.length >= 5
                  }
                  onChange={() => toggleTag(tag)}
                />
                <span>
                  <Check size={13} />
                  {tag}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="add-post-field">
          <span className="add-post-field__label">Хэштеги</span>
          <span className="add-post-field__description">
            Введите через пробел — символ # добавлять необязательно
          </span>
          <div className="add-post-hashtags">
            <Hash aria-hidden="true" size={19} />
            <MainInput
              className="add-post-field__input"
              name="hashtags"
              value={formData.hashtags}
              onChange={(e) => updateField("hashtags")(e.target.value)}
              placeholder="дизайн вдохновение интерфейсы"
            />
          </div>
        </label>

        <div className="add-post-field">
          <span className="add-post-field__label">Изображение</span>
          <input
            accept="image/*"
            className="add-post-media__input"
            id="add-post-media"
            name="image"
            type="file"
            ref={imageRef}
            onChange={addImage}
          />
          <label className="add-post-media" htmlFor="add-post-media">
            <span className="add-post-media__icon" aria-hidden="true">
              <ImagePlus size={26} />
            </span>
            <span className="add-post-media__text">
              <strong>Добавить изображение</strong>
              <small>PNG, JPG или WEBP до 10 МБ</small>
            </span>
            {preview && (
              <div className="relative">
                <img src={preview} />
                <IconButton
                  typeBtn="danger"
                  size="small"
                  className="absolute top-3 right-3"
                  onClick={removeImage}
                >
                  <Trash2 size={18} />
                </IconButton>
              </div>
            )}
            <span className="btn default medium add-post-media__action">
              Выбрать файл
            </span>
          </label>
        </div>
        {error && <span className="text-red text-[11px]">{error}</span>}
      </form>
    </div>
  );
};

export default AddPostEditor;
