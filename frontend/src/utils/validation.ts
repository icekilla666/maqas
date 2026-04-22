import z from "zod";

export const loginSchema = z.object({
  email: z.email("Неверный формат email"),
  password: z.string().min(8, "Пароль должен быть минимум 6 символов"),
});

export const registerSchema = z
  .object({
    username: z.string().min(3, "Имя пользователя минимум 3 символа"),
    name: z.string().min(2, "Имя минимум 2 символа"),
    email: z.email("Неверный формат email"),
    password: z.string().min(6, "Пароль должен быть минимум 6 символов"),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Пароли не совпадают",
    path: ["password_confirm"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export const validateLogin = (data: unknown) => {
  return loginSchema.safeParse(data);
};
export const validateRegister = (data: unknown) => {
  return registerSchema.safeParse(data);
};

export const formatZodErrors = (error: z.ZodError) => {
  return z.treeifyError(error);
};

export const validateEmail = (email: string) => {
  return z.email().safeParse(email);
};

export const validatePassword = (password: string) => {
  return z.string().min(6).safeParse(password);
};

export const validateUsername = (username: string) => {
  return z.string().min(3).safeParse(username);
};
