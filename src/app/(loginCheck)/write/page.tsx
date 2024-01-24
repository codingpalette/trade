"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Camera, Loader2, Menu } from "lucide-react";

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
import { useRef, useState } from "react";
import { imageUpload } from "@/actions/imageAction";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { productsInsert } from "@/actions/products";
import { productsFormSchema } from "@/types/formType";

export default function WritePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  const form = useForm<z.infer<typeof productsFormSchema>>({
    resolver: zodResolver(productsFormSchema),
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
      setFileUploadLoading(true);
      const selectedFile: File = file.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const res = await imageUpload(formData);
        console.log("res", res);
        if (res) {
          form.setValue("images", [
            ...form.getValues("images"),
            {
              cloudflare_id: res.cloudflare_id,
              image_url: res.image_url,
            },
          ]);
          // input 파일 초기화
          file.target.value = "";
          setFileUploadLoading(false);
        }
      } catch (error) {
        console.log("error", error);
        // input 파일 초기화
        file.target.value = "";
        setFileUploadLoading(false);
      }
    }
  }

  async function onSubmit(values: z.infer<typeof productsFormSchema>) {
    try {
      const res = await productsInsert(values);
      if (!res) {
        toast({
          title: "상품 등록 실패",
          description: "상품 등록에 실패했습니다.",
        });
        return;
      }
      toast({
        title: "상품 등록 성공",
        description: "상품 등록에 성공했습니다.",
      });
      router.push("/");
    } catch (error) {
      console.log("error", error);
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
            <FormItem>
              <FormLabel>이미지</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {form.watch("images")?.map((data, index) => {
                    return (
                      <Button
                        key={index}
                        className="relative h-20 w-20 overflow-hidden"
                        size="icon"
                        variant="outline"
                        type="button"
                      >
                        <div>
                          <img
                            src={`${data.image_url}/thumbnail`}
                            alt=""
                            className="block h-20 w-20 object-cover"
                          />
                        </div>
                      </Button>
                    );
                  })}
                  {form.watch("images")?.length < 10 && (
                    <>
                      <Button
                        className="h-20 w-20"
                        variant="outline"
                        size="icon"
                        onClick={onClickCamera}
                        disabled={fileUploadLoading}
                      >
                        {fileUploadLoading ? (
                          <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                          <Camera className="h-8 w-8" />
                        )}
                      </Button>
                      <input
                        hidden
                        type="file"
                        ref={inputRef}
                        accept="image/*"
                        onChange={imageChange}
                      />
                    </>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                최대 10장의 이미지를 업로드 할 수 있습니다.
              </FormDescription>
            </FormItem>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="제목을 입력해 주세요."
                      {...field}
                      maxLength={30}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="내용을 입력해 주세요."
                      {...field}
                      maxLength={500}
                      rows={5}
                    />
                  </FormControl>
                  <FormDescription>
                    상품의 내용을 입력해 주세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button type="submit">저장</Button>
              <Button type="button" variant="outline">
                <Link href="/">취소</Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
