import z, { array } from "zod";

export const addPostSchema = z
  .object({
    title: z.string().max(120),
    content: z.string().max(2500),
    image: z.instanceof(File).nullable(),
    tags: array(z.string()).max(5),
    hashtags: z.string().optional(),
  })
  .refine(
    (data) =>
      data.title.trim().length > 0 ||
      data.content.trim().length > 0 ||
      data.image !== null,
    {
      message:
        "Добавьте хотя бы что-то из перечисленного: заголовок, текст, изображение",
    },
  );
