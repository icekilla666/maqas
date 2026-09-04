import z from "zod";
import { POST_TAGS } from "../constants";

export const addPostSchema = z
  .object({
    title: z.string().max(120),
    content: z.string().max(2500),
    image: z.instanceof(File).nullable(),
    tags: z.array(z.enum(POST_TAGS)).max(5),
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
