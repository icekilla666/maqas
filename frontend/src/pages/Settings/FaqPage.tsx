import TitlePage from "@/components/common/TitlePage";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqItems = [
  {
    question: "Как изменить данные профиля?",
    answer:
      "Открой настройки, перейди в редактирование профиля и нажми на иконку карандаша рядом с нужным полем. После изменения данных нажми кнопку сохранения",
  },
  {
    question: "Как поменять аватар?",
    answer:
      "На странице редактирования профиля нажми на маленькую кнопку с карандашом рядом с аватаром и выбери изображение с устройства",
  },
  {
    question: "Почему я не вижу часть профилей?",
    answer:
      "Профили могут быть удалены, заблокированы или временно недоступны. В таких случаях приложение может скрывать часть информации",
  },
  {
    question: "Где посмотреть подписчиков и подписки?",
    answer:
      "Открой свой профиль или профиль другого пользователя и нажми на счетчик подписчиков или подписок. Откроется соответствующий список",
  },
  {
    question: "Что делает черный список?",
    answer:
      "Черный список нужен для ограничения взаимодействия с выбранными пользователями. Заблокированные аккаунты не должны мешать просмотру основного контента",
  },
  {
    question: "Как выйти из аккаунта?",
    answer:
      "В настройках есть действия выхода из аккаунта и выхода со всех устройств. Перед выполнением действия появится окно подтверждения",
  },
];

const FaqPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section>
      <div className="container">
        <TitlePage title="Часто задаваемые вопросы" />
        <div className="faq-list">
          {faqItems.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                className={`faq-accordion ${isActive ? "active" : ""}`.trim()}
                key={item.question}
              >
                <button
                  aria-expanded={isActive}
                  className="faq-accordion__trigger"
                  onClick={() => toggleAccordion(index)}
                  type="button"
                >
                  <span>{item.question}</span>
                  <ChevronDown className="faq-accordion__icon" size={26} />
                </button>
                {isActive && (
                  <div className="faq-accordion__content">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqPage;
