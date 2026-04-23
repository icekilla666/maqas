import MainInput from "../../../components/ui/MainInput";
interface LoginProps {
  formData: {
    email: string;
    password: string;
  };
  updateField: (
    field: string,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  getFieldError: (field: string) => string | undefined;
}
const Login = ({ formData, updateField, getFieldError }: LoginProps) => {
  return (
    <>
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
    </>
  );
};
export default Login;
