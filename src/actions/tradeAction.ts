"use server";

import { Database } from "@/type/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export async function myItems(id: string | undefined) {
  const supabase = createServerComponentClient<Database>({ cookies });

  if (!id) {
    throw new Error("id is not defined");
  }

  const { data, error } = await supabase
    .from("products")
    .select(`*,  product_images(*)`)
    .eq("user_id", id)
    .eq("state", 0);

  if (error) throw error;
  return data;
}
