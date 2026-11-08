import { useId, useLayoutEffect, useRef, useState } from "react";

// Четвёртую строку разрешаем целиком, чтобы не скрывать короткий остаток.
const FULL_TEXT_LINES = 4;

const CommentText = ({ content, deleted }: { content: string; deleted: boolean }) => {
  const measureRef = useRef<HTMLParagraphElement>(null);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const textId = useId();

  useLayoutEffect(() => {
    const element = measureRef.current;
    if (!element || deleted) return;

    const measure = () => {
      if (!element.getClientRects().length || element.clientWidth === 0) return;
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      setNeedsExpansion(element.getBoundingClientRect().height > lineHeight * FULL_TEXT_LINES + 1);
    };
    measure();
    // Изменение ширины, загрузка шрифта и показ скрытых ответов меняют размер текста.
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [content, deleted]);

  const collapsed = !deleted && needsExpansion && !expanded;

  return (
    <div className="comment-text">
      {!deleted && (
        <div className="comment-text__measure" aria-hidden="true">
          <p ref={measureRef} className="comment-item__text">{content}</p>
        </div>
      )}
      <p
        id={textId}
        className={`comment-item__text${deleted ? " comment-item__text--deleted" : ""}${collapsed ? " comment-text__clamped" : ""}`}
      >
        {deleted ? "Комментарий удален" : content}
      </p>
      {collapsed && (
        <button
          className="comment-item__read-more"
          type="button"
          aria-expanded={false}
          aria-controls={textId}
          onClick={() => setExpanded(true)}
        >
          Читать дальше
        </button>
      )}
    </div>
  );
};

export default CommentText;
