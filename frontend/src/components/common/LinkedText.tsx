import { LinkifyIt } from "linkify-it";
import type { ReactNode } from "react";

const linkify = new LinkifyIt({ fuzzyLink: true, fuzzyEmail: false })
  .add("ftp:", null)
  .add("mailto:", null);

const LinkedText = ({ children }: { children: string }) => {
  const matches = linkify.match(children);
  if (!matches) return children;

  const parts: ReactNode[] = [];
  let offset = 0;
  for (const match of matches) {
    parts.push(children.slice(offset, match.index));
    const href = !match.schema
      ? `https://${match.raw}`
      : match.schema === "//" ? `https:${match.raw}` : match.url;

    // Только веб-ссылки. Исходный текст всегда остаётся обычным React-текстом.
    if (/^https?:\/\//i.test(href)) {
      parts.push(
        <a
          key={match.index}
          className="text-link"
          href={href}
          target="_blank"
          rel="noopener noreferrer ugc"
          onClick={(event) => event.stopPropagation()}
        >
          {children.slice(match.index, match.lastIndex)}
        </a>,
      );
    } else {
      parts.push(children.slice(match.index, match.lastIndex));
    }
    offset = match.lastIndex;
  }
  parts.push(children.slice(offset));
  return <>{parts}</>;
};

export default LinkedText;
