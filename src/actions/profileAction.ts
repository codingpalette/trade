"use server";

import { Database } from "@/type/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { profileFormSchema } from "@/type/formType";

export async function profileUpdate(values: z.infer<typeof profileFormSchema>) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: values.name,
    })
    .eq("user_id", values.user_id);
  if (error) {
    return false;
  }
  revalidatePath("/profile/*");
  return true;
}
