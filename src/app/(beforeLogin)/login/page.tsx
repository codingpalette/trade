"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
// import supabase from "@/utils/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const formSchema = z.object({
  email: z.string().email({
    message: "이메일 형식이 아닙니다.",
  }),
  // username: z.string().min(2, {
  //   message: "Username must be at least 2 characters.",
  // }),
});

export default function LoginPage() {
  const supabase = createClientComponentClient();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const { data, error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        // shouldCreateUser: false,
        emailRedirectTo: process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_TO,
      },
    });
  }

  return (
    // 화면 중앙에 오고 폭이 1/2
    <div className="mx-auto mt-24 w-full max-w-[780px] px-4">
      <div>{process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_TO}</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일로 로그인</FormLabel>
                <FormControl>
                  <Input placeholder="이메일을 입력해 주세요." {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">로그인</Button>
        </form>
      </Form>
      {/* <h1>Login Page</h1> */}
    </div>
  );
}
