import { useCallback, useState, type ChangeEvent } from "react";
import {
  formatZodErrors,
  loginSchema,
  registerSchema,
} from "../utils/validation";

export const useAuth = (isLogin: boolean) => {
  const [formData, setFormData] = useState(() => ({
    username: "",
    name: "",
    email: "",
    password: "",
    password_confirm: "",
  }));
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const schema = isLogin ? loginSchema : registerSchema;

  const validate = useCallback(() => {
    const dataToValidate = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;
    const result = schema.safeParse(dataToValidate);
    if (result.success) return undefined;
    return formatZodErrors(result.error);
  }, [schema, formData, isLogin]);

  const getFieldError = (field: string) => {
    const errors: Record<string, { _errors: string[] }> | undefined = showErrors
      ? validate()
      : undefined;
    return errors?.[field]?._errors?.[0];
  };

  const updateField = useCallback((field: string) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }, []);

  const handleSubmit = useCallback(
    async (submitFn: () => Promise<void>) => {
      setShowErrors(true);
      const validationErrors = validate();
      if (validationErrors) return;
      setIsLoading(true);
      setServerError("");
      try {
        await submitFn();
        setFormData({
          email: "",
          password: "",
          username: "",
          name: "",
          password_confirm: "",
        });
        setShowErrors(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error) {
          setServerError(error.response?.data?.detail);
        } else {
          setServerError("Неизвестная ошибка");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [validate],
  );

  const getSubmitData = useCallback(() => {
    if (isLogin) {
      return { email: formData.email, password: formData.password };
    }
    return formData;
  }, [formData, isLogin]);

  return {
    formData,
    getFieldError,
    isLoading,
    serverError,
    updateField,
    handleSubmit,
    getSubmitData,
  };
};
