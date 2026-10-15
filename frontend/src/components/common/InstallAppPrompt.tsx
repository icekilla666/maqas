import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import Modal from "@/components/ui/Modals/Modal";
import MainButton from "@/components/ui/Buttons/MainButton";
import { detectInstallPlatform, installInstructions, isInstalledApp, type InstallPlatform } from "@/utils/installInstructions";

const HIDE_KEY = "maqas-hide-install-guide";
const SESSION_KEY = "maqas-install-guide-seen";

const InstallAppPrompt = () => {
  const [open, setOpen] = useState(false);
  const [remember, setRemember] = useState(false);
  const [platform, setPlatform] = useState(detectInstallPlatform);

  useEffect(() => {
    if (isInstalledApp()) return;
    try {
      if (localStorage.getItem(HIDE_KEY) === "true" || sessionStorage.getItem(SESSION_KEY)) return;
    } catch { /* Подсказка работает и без доступа к хранилищу. */ }
    const timer = window.setTimeout(() => setOpen(true), 1500);
    const hide = () => { window.clearTimeout(timer); setOpen(false); };
    const displayMode = window.matchMedia("(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)");
    const handleMode = () => { if (isInstalledApp()) hide(); };
    window.addEventListener("appinstalled", hide);
    displayMode.addEventListener("change", handleMode);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("appinstalled", hide);
      displayMode.removeEventListener("change", handleMode);
    };
  }, []);

  const close = () => {
    try { sessionStorage.setItem(SESSION_KEY, "true"); } catch { /* Без сохранения. */ }
    setOpen(false);
  };

  const changeRemember = (checked: boolean) => {
    setRemember(checked);
    try {
      if (checked) localStorage.setItem(HIDE_KEY, "true");
      else localStorage.removeItem(HIDE_KEY);
    } catch { /* Без сохранения. */ }
  };

  return (
    <Modal open={open} onClose={close} className="install-guide" ariaLabel="Установить Maqas">
      <div className="install-guide__header">
        <Download size={24} aria-hidden="true" />
        <h2>Установить Maqas</h2>
        <button type="button" onClick={close} aria-label="Закрыть инструкцию"><X size={22} /></button>
      </div>
      <p>Добавьте приложение на устройство, чтобы открывать его с отдельной иконки.</p>
      <label className="install-guide__platform">
        Ваше устройство и браузер
        <select value={platform} onChange={event => setPlatform(event.target.value as InstallPlatform)}>
          {Object.entries(installInstructions).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
        </select>
      </label>
      <ol>{installInstructions[platform].steps.map(step => <li key={step}>{step}</li>)}</ol>
      <label className="install-guide__remember">
        <input type="checkbox" checked={remember} onChange={event => changeRemember(event.target.checked)} />
        Не показывать больше
      </label>
      <MainButton type="button" onClick={close} align="center">Понятно</MainButton>
    </Modal>
  );
};

export default InstallAppPrompt;
