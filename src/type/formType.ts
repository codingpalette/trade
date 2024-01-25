import * as z from "zod";
export const productsFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "제목을 2자 이상 입력해 주세요.",
    })
    .max(30, {
      message: "제목을 30자 이하로 입력해 주세요.",
    }),
  content: z
    .string()
    .min(2, {
      message: "내용을 2자 이상 입력해 주세요.",
    })
    .max(500, {
      message: "내용을 500자 이하로 입력해 주세요.",
    }),
  images: z.array(
    z.object({
      cloudflare_id: z.string(),
      image_url: z.string(),
    }),
  ),
});

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "이메일 형식이 아닙니다.",
  }),
});
