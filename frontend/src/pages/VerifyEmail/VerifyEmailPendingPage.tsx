import { useAuthStore } from "@/store/auth.store";
import VerifyEmailWrapper from "./components/VerifyEmailWrapper";

const VerifyEmailPendingPage = () => {
  const pendingEmail = useAuthStore((state) => state.pendingEmail)
  return (
    <section className="h-svh flex justify-center items-center px-7">
      <VerifyEmailWrapper
        title="Проверьте свою почту!"
        text="Что бы закончить регистрацию, мы отправили вам письмо на почту."
        variant="wait"
        button={true}
        email={pendingEmail!}
      />
    </section>
  );
};

export default VerifyEmailPendingPage;
