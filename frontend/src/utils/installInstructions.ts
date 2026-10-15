export const installInstructions = {
  ios: {
    label: "iPhone / iPad — Safari",
    steps: ["Откройте maqas.ru в Safari.", "Откройте меню «Поделиться» и выберите «На экран Домой».", "Если есть переключатель «Открывать как веб-приложение», включите его. Нажмите «Добавить»."],
  },
  android: {
    label: "Android — Chrome / Edge",
    steps: ["Откройте maqas.ru в Chrome или Edge.", "Нажмите меню ⋮ и выберите «Установить приложение» или «Добавить на главный экран».", "Подтвердите установку. Открывайте Maqas через появившуюся иконку."],
  },
  samsung: {
    label: "Android — Samsung Internet",
    steps: ["Откройте maqas.ru в Samsung Internet.", "В меню браузера выберите «Добавить страницу в» → «Главный экран» или значок установки в адресной строке.", "Подтвердите добавление."],
  },
  firefox: {
    label: "Android — Firefox",
    steps: ["Откройте maqas.ru в Firefox.", "Откройте меню ⋮ и выберите «Установить» или «Добавить на домашний экран».", "Подтвердите добавление приложения."],
  },
  chrome: {
    label: "Windows / macOS / Linux — Chrome",
    steps: ["Откройте maqas.ru в Chrome.", "Нажмите значок установки справа в адресной строке. Если его нет, откройте меню → «Трансляция, сохранение и отправка» → «Установить страницу как приложение».", "Подтвердите установку Maqas."],
  },
  edge: {
    label: "Компьютер — Microsoft Edge",
    steps: ["Откройте maqas.ru в Edge.", "Нажмите значок установки в адресной строке или откройте меню … → «Другие инструменты» → «Приложения» → «Установить этот сайт как приложение».", "Подтвердите установку."],
  },
  safari: {
    label: "macOS — Safari",
    steps: ["Откройте maqas.ru в Safari на macOS Sonoma или новее.", "В меню «Файл» выберите «Добавить в Dock».", "Нажмите «Добавить». Иконка Maqas появится в Dock."],
  },
  other: {
    label: "Другой браузер",
    steps: ["На iPhone или iPad откройте сайт в Safari. На Android и компьютере — в Chrome или Edge.", "Выберите соответствующий браузер в списке выше и следуйте инструкции."],
  },
};

export type InstallPlatform = keyof typeof installInstructions;

export const detectInstallPlatform = (): InstallPlatform => {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/i.test(ua)) {
    if (/SamsungBrowser/i.test(ua)) return "samsung";
    if (/Firefox/i.test(ua)) return "firefox";
    return /Chrome|EdgA/i.test(ua) ? "android" : "other";
  }
  if (/Edg\//i.test(ua)) return "edge";
  if (/Chrome\//i.test(ua)) return "chrome";
  if (/Macintosh/i.test(ua) && /Safari/i.test(ua)) return "safari";
  return "other";
};

export const isInstalledApp = () =>
  window.matchMedia("(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;
