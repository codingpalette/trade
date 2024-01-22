"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Camera, Menu } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { imageUpload } from "@/actions/imageAction";

const formSchema = z.object({
  // email: z.string().email({
  //   message: "이메일 형식이 아닙니다.",
  // }),

  title: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  content: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  images: z.array(z.string()),
});

export default function WritePage() {
  const supabase = createClientComponentClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      images: [],
    },
  });

  function onClickCamera(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    inputRef.current?.click();
  }

  async function imageChange(file: React.ChangeEvent<HTMLInputElement>) {
    console.log("file", file.target.files);

    if (file.target.files && file.target.files.length > 0) {
      const selectedFile: File = file.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const res = await imageUpload(formData);
        console.log("res", res);
      } catch (error) {
        console.log("error", error);
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("22222");
  }

  return (
    <>
      <div className="mt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <FormItem>
              <FormLabel>이미지</FormLabel>
              <FormControl>
                <div>
                  <Button variant="outline" size="icon" onClick={onClickCamera}>
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={inputRef}
                    accept="image/*"
                    onChange={imageChange}
                  />
                </div>
              </FormControl>
              {/* <FormDescription>
            This is your public display name.
          </FormDescription> */}
            </FormItem>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="제목을 입력해 주세요." {...field} />
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
        <h1>WritePage</h1>
      </div>
    </>
  );
}
