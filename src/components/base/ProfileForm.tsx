"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { profileFormSchema } from "@/type/formType";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { profileUpdate } from "@/actions/profileAction";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  data: {
    user_id: string;
    email: string;
    created_at: string;
    display_name: string;
  };
}

export default function ProfileForm({ data }: ProfileFormProps) {
  const supabase = createClientComponentClient();
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: data.display_name,
      email: data?.email,
      user_id: data.user_id,
    },
  });

  const [updateLoading, setUpdateLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    setUpdateLoading(true);
    try {
      const res = await profileUpdate(values);
      console.log("res", res);
      if (!res) {
        toast({
          title: "프로필 수정에 실패했습니다.",
          // description: "상품 등록에 실패했습니다.",
        });
        return;
      }
      toast({
        title: "프로필 수정에 성공했습니다.",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setUpdateLoading(false);
    }
  }

  return (
    <>
      <div className="mt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>닉네임</FormLabel>
                  <FormControl>
                    <Input placeholder="닉네임을 입력해 주세요." {...field} />
                  </FormControl>
                  {/* <FormDescription>이름을 입력해 주세요.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button type="submit" disabled={updateLoading}>
                {updateLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                저장
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
