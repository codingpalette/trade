// "use client";

// import supabase from "@/utils/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

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
import { Button } from "@/components/ui/button";

import ContentBox from "@/components/base/ContentBox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/type/database.types";
import { cookies } from "next/headers";
import { ImageOff } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import MainPageContent from "@/components/base/MainPageContent";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  body: z.string().min(2, {
    message: "Body must be at least 2 characters.",
  }),

  // email: z.string().email({
  //   message: "이메일 형식이 아닙니다.",
  // }),
  // username: z.string().min(2, {
  //   message: "Username must be at least 2 characters.",
  // }),
});

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data } = await supabase
    .from("products")
    .select(`*, product_images(*)`)
    .order("id", { ascending: false })
    .limit(20);

  // const { count } = await supabase
  //   .from("products")
  //   .select("*", { count: "exact" });

  // console.log("count", count);

  // console.log("data", data);

  // async function load() {
  //   const { data } = await supabase.from("page").select("*");
  //   console.log("data", data);
  // }

  // useEffect(() => {
  //   load();
  // }, []);

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     title: "",
  //     body: "",
  //   },
  // });

  // 2. Define a submit handler.
  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   // Do something with the form values.
  //   // ✅ This will be type-safe and validated.
  //   console.log(values);
  //   try {
  //     const res = await supabase.from("page").insert([
  //       {
  //         title: values.title,
  //         body: values.body,
  //       },
  //     ]);
  //     console.log("res", res);
  //     await load();
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // }

  // async function logOut() {
  //   const { error } = await supabase.auth.signOut();
  //   console.log("error", error);
  // }

  return (
    <>
      <MainPageContent data={data} />

      {/* <div>2222</div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>title</FormLabel>
                <FormControl>
                  <Input placeholder="제목을 입력해 주세요." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>body</FormLabel>
                <FormControl>
                  <Input placeholder="내용을 입력해 주세요." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">전송</Button>
        </form>
      </Form>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
      <div>
        <Button onClick={logOut}>로그아웃</Button>
      </div> */}
    </>
  );
}
