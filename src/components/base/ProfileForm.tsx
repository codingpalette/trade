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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { profileFormSchema } from "@/type/formType";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authDelete, profileUpdate } from "@/actions/profileAction";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  data: {
    user_id: string;
    email: string;
    created_at: string;
    display_name: string;
  };
}

export default function ProfileForm({ data }: ProfileFormProps) {
  const router = useRouter();
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

  const [userEmailCheck, setUserEmailCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  async function userDelEvent() {
    setDelLoading(true);
    try {
      await authDelete(data.user_id);
      toast({
        title: "회원탈퇴에 성공했습니다.",
      });
      const { error } = await supabase.auth.signOut();
      // router.push("/");
      // window.location.href = "/";
    } catch (error) {
      console.error(error);
      toast({
        title: "회원탈퇴에 실패했습니다.",
      });
    } finally {
      setDelLoading(false);
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" type="button">
                    회원탈퇴
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>회원탈퇴</DialogTitle>
                    <DialogDescription>
                      정말로 회원탈퇴를 하시겠습니까?
                    </DialogDescription>
                    <DialogDescription>
                      회원탈퇴를 하시면 모든 정보가 삭제됩니다.
                    </DialogDescription>
                    <DialogDescription>
                      본인 이메일을 입력해 주세요.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        이메일
                      </Label>
                      <Input
                        id="check_email"
                        // defaultValue=""
                        className="col-span-3"
                        value={emailCheck}
                        onChange={(e) => {
                          setEmailCheck(e.target.value);
                          if (e.target.value === data.email) {
                            setUserEmailCheck(true);
                          } else {
                            setUserEmailCheck(false);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      disabled={!userEmailCheck || delLoading}
                      onClick={userDelEvent}
                    >
                      {delLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      회원탈퇴
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
