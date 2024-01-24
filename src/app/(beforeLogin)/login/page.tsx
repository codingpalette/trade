"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { loginFormSchema } from "@/types/formType";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const [disabled, setDisabled] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    setDisabled(true);
    const { data, error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        // shouldCreateUser: false,
        emailRedirectTo: process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_TO,
      },
    });
    console.log("data", data);
    console.log("error", error);
    setDisabled(false);
    if (error) {
      toast({
        title: "로그인 메일 발송에 실패했습니다.",
        description: "60초에 한번만 발송할 수 있습니다.",
      });
    } else {
      toast({
        title: "로그인 메일 발송에 성공했습니다.",
        description: "로그인 메일을 확인해주세요.",
      });
    }
  }

  return (
    // 화면 중앙에 오고 폭이 1/2
    <div className="mx-auto mb-12 mt-12 w-full max-w-[780px] px-4 lg:mt-24">
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={disabled}>
            {disabled && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            로그인
          </Button>
        </form>
      </Form>
      <div className="mx-auto mt-8 max-w-[350px]">
        <img src="/images/login_image.svg" />
      </div>
    </div>
  );
}
