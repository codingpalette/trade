"use server";

import { Database } from "@/type/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { productsFormSchema } from "@/type/formType";

export async function productsInsert(
  values: z.infer<typeof productsFormSchema>,
) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        title: values.title,
        content: values.content,
      },
    ])
    .select("id");

  if (error) {
    return false;
  }
  // 상품 등록 후 이미지 업로드
  if (data && data.length > 0) {
    if (values.images.length > 0) {
      const productId = data[0].id;
      const images = values.images.map((data) => {
        return {
          product_id: productId,
          cloudflare_id: data.cloudflare_id,
          image_url: data.image_url,
        };
      });
      await supabase.from("product_images").insert(images);
    }
  }
  revalidatePath("/");
  return true;
}
