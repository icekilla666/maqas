import VerifyEmailWrapper from "./components/VerifyEmailWrapper";

const VerifyEmailPendingPage = () => {
  return (
    <section className="h-svh flex justify-center items-center px-7">
      <VerifyEmailWrapper
        title="Проверьте свою почту!"
        text="Что бы закончить регистрацию, мы отправили вам письмо на почту."
        variant="wait"
        button="отправить сообщение повторно"
      />
    </section>
  );
};

export default VerifyEmailPendingPage;
