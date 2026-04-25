import MainInput from "@/components/ui/MainInput";

interface RegistrationProps {
  formData: {
    username: string;
    name: string;
    email: string;
    password: string;
    password_confirm: string;
  };
  updateField: (
    field: string,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  getFieldError: (field: string) => string | undefined;
}
const Registration = ({
  formData,
  updateField,
  getFieldError,
}: RegistrationProps) => {
  return (
    <>
      <MainInput
        value={formData.name}
        onChange={updateField("name")}
        name="name"
        placeholder="имя"
        type="text"
        error={getFieldError("name")}
      />
      <MainInput
        value={formData.username}
        onChange={updateField("username")}
        name="username"
        placeholder="юзернейм"
        type="text"
        error={getFieldError("username")}
      />
      <MainInput
        value={formData.email}
        onChange={updateField("email")}
        name="email"
        placeholder="почта"
        type="email"
        error={getFieldError("email")}
      />
      <MainInput
        value={formData.password}
        onChange={updateField("password")}
        name="password"
        placeholder="пароль"
        type="password"
        error={getFieldError("password")}
      />
      <MainInput
        value={formData.password_confirm}
        onChange={updateField("password_confirm")}
        name="password_confirm"
        placeholder="повторите пароль"
        type="password"
        error={getFieldError("password_confirm")}
      />
    </>
  );
};

export default Registration;
