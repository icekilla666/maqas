import { useAuthStore } from "@/store/auth.store";
import VerifyEmailWrapper from "./components/VerifyEmailWrapper";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { HOME_PAGE } from "@/utils/constants";

const VerifyEmailPendingPage = () => {
  const pendingEmail = useAuthStore((state) => state.pendingEmail)
  return (
    <section className="min-h-svh flex flex-col justify-center items-center gap-6 px-7 py-8">
      <VerifyEmailWrapper
        title="Проверьте свою почту!"
        text="Что бы закончить регистрацию, мы отправили вам письмо на почту."
        variant="wait"
        button={true}
        email={pendingEmail!}
      />
      <Link
        to={HOME_PAGE}
        replace
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-second/70 transition-colors hover:text-second focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Вернуться на главную
      </Link>
    </section>
  );
};

export default VerifyEmailPendingPage;
