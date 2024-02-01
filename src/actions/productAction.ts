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

  // 상품 데이터 객체
  const productData = {
    title: values.title,
    content: values.content,
  };

  // 상품 생성 또는 업데이트
  let data;
  let error;
  if (values.id) {
    // 상품 수정
    const updateResponse = await supabase
      .from("products")
      .update(productData)
      .eq("id", values.id)
      .select("id");

    data = updateResponse.data;
    error = updateResponse.error;
  } else {
    // 상품 생성
    const insertResponse = await supabase
      .from("products")
      .insert([productData])
      .select("id");

    data = insertResponse.data;
    error = insertResponse.error;
  }

  if (error) throw error;

  // 상품 등록 후 이미지 삭제
  if (
    data &&
    data.length > 0 &&
    values.del_images &&
    values.del_images.length > 0
  ) {
    const images = values.del_images.map((image) => image.id);
    await supabase.from("product_images").delete().in("id", images);
  }

  // 상품 등록 후 이미지 업로드
  if (
    data &&
    data.length > 0 &&
    values.new_images &&
    values.new_images.length > 0
  ) {
    const productId = values.id ? values.id : data[0].id;
    const images = values.new_images.map((image) => ({
      product_id: productId,
      cloudflare_id: image.cloudflare_id,
      image_url: image.image_url,
    }));
    await supabase.from("product_images").insert(images);
  }

  revalidatePath("/");
  return true;
}
