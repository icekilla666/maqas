import MainInput from "@/components/ui/Inputs/MainInput";
import Textarea from "@/components/ui/Inputs/Textarea";
import { POST_TAGS } from "@/utils/constants";
import { Check, Hash, ImagePlus } from "lucide-react";
import AddPostEditorHeader from "./AddPostEditorHeader";

const AddPostEditor = () => {
  return (
    <div className="add-post-editor">

      <AddPostEditorHeader />
      <div className="add-post-fields">
        <label className="add-post-field">
          <span className="add-post-field__label">Заголовок</span>
          <MainInput
            className="add-post-field__input"
            maxLength={120}
            name="title"
            placeholder="О чём ваша публикация?"
          />
          <span className="add-post-field__hint">До 120 символов</span>
        </label>

        <Textarea
          className="add-post-content"
          hint="До 2500 символов"
          label="Текст публикации"
          maxLength={2500}
          name="content"
          placeholder="Поделитесь историей, идеей или полезным опытом..."
          rows={9}
        />

        <fieldset className="add-post-field add-post-tags">
          <legend className="add-post-field__label">Темы</legend>
          <p className="add-post-field__description">
            Выберите до пяти тем, чтобы публикацию было проще найти
          </p>
          <div className="add-post-tags__list">
            {POST_TAGS.map((tag) => (
              <label className="add-post-tag" key={tag}>
                <input name="tags" type="checkbox" value={tag} />
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
              placeholder="дизайн вдохновение интерфейсы"
            />
          </div>
        </label>

        <div className="add-post-field">
          <span className="add-post-field__label">Изображение</span>
          <input
            accept="image/jpeg,image/png,image/webp"
            className="add-post-media__input"
            id="add-post-media"
            name="image"
            type="file"
          />
          <label className="add-post-media" htmlFor="add-post-media">
            <span className="add-post-media__icon" aria-hidden="true">
              <ImagePlus size={26} />
            </span>
            <span className="add-post-media__text">
              <strong>Добавить изображение</strong>
              <small>PNG, JPG или WEBP до 10 МБ</small>
            </span>
            <span className="add-post-media__action">Выбрать файл</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AddPostEditor;
