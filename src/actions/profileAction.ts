"use server";

import { Database } from "@/type/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { profileFormSchema } from "@/type/formType";
import { createClient } from "@supabase/supabase-js";

// 유저 프로필 업데이트
export async function profileUpdate(values: z.infer<typeof profileFormSchema>) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: values.name,
    })
    .eq("user_id", values.user_id);
  if (error) throw error;
  revalidatePath("/profile/*");
  return data;
}

// 유저 auth 삭제
export async function authDelete(user_id: string) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE;
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }
  if (!key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE is not defined");
  }
  const supbaseAdmin = createClient(supabaseUrl, key);
  const { data, error } = await supbaseAdmin.auth.admin.deleteUser(user_id);
  if (error) throw error;
  console.log("ccc");
  // nextjs cache 삭제
  revalidatePath("*");
  return data;
}
