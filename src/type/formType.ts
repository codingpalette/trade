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

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "닉네임을 2글자 이상 입력해 주세요.",
    })
    .refine(
      (value) => value.trim().length > 0,
      "공백만으로 구성된 닉네임은 유효하지 않습니다.",
    ),
  email: z.string(),
  user_id: z.string(),
});
