export const anchor = (id: string) => {
  const el = document.getElementById(id.replace(/^#/, ""));
  if (!el) return;

  let cancelled = false;
  let frame = 0;
  // Images above the target can move it after the post data has loaded.
  const images = Array.from(document.images).filter(
    (image) =>
      !image.complete &&
      Boolean(image.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING),
  );

  void Promise.all(images.map((image) => image.decode().catch(() => {}))).then(() => {
    if (cancelled) return;
    frame = requestAnimationFrame(() => {
      if (!el.isConnected) return;
      el.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
        inline: "nearest",
      });
    });
  });

  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
  };
};
