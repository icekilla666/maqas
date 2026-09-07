export const USE_MOCK_POSTS = false;
export const MOCK_DELAY_MS = 350;

export const wait = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
