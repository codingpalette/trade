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
    .eq("state", 0)
    .order("id", { ascending: false });

  if (error) throw error;
  return data;
}

async function checkItemState(itemId: number, itemName: string) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: item, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", itemId)
    .single();

  if (error)
    throw new Error(error.message || "알 수 없는 에러가 발생했습니다.");
  if (item.state !== 0)
    throw new Error(`${itemName}이(가) 이미 교환중이거나 교환완료 상태입니다.`);

  return item;
}

async function updateItemState(itemId: number) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { error } = await supabase
    .from("products")
    .update({ state: 1 })
    .eq("id", itemId);

  if (error)
    throw new Error(error.message || "상태 업데이트 중 에러가 발생했습니다.");
}

export async function tradeInsert(myItemId: number, targetItemId: number) {
  const supabase = createServerComponentClient<Database>({ cookies });
  // 우선 상대방 아이템이 교환 가능한지 확인
  const targetItem = await checkItemState(targetItemId, "상대방 아이템");
  // 내 아이템이 교환 가능한지 확인
  const myItem = await checkItemState(myItemId, "내 아이템");

  // product_trades에 교환 요청 추가
  const { data, error } = await supabase
    .from("product_trades")
    .insert([
      {
        req_product_id: targetItemId,
        req_user_id: targetItem.user_id,
        res_product_id: myItemId,
        res_user_id: myItem.user_id,
      },
    ])
    .select("id")
    .single();

  if (error)
    throw new Error(error.message || "교환 요청 중 에러가 발생했습니다.");

  // 아이템 상태 변경
  await updateItemState(myItemId);
  await updateItemState(targetItemId);
  revalidatePath("/");
  revalidatePath("/my_items");
  revalidatePath("/trade_output");

  return data;
}

export async function tradeDelete(id: number, reqId: number, resId: number) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data, error } = await supabase
    .from("product_trades")
    .delete()
    .eq("id", id)
    .single();
  if (error)
    throw new Error(error.message || "교환 요청 삭제 중 에러가 발생했습니다.");

  const { data: reqData, error: reqError } = await supabase
    .from("products")
    .update({ state: 0 })
    .eq("id", reqId);
  if (reqError) {
    throw new Error(
      reqError.message || "교환 요청 삭제 중 에러가 발생했습니다.",
    );
  }
  const { data: resData, error: resError } = await supabase
    .from("products")
    .update({ state: 0 })
    .eq("id", resId);
  if (resError) {
    throw new Error(
      resError.message || "교환 요청 삭제 중 에러가 발생했습니다.",
    );
  }
  revalidatePath("/");
  revalidatePath("/my_items");
  revalidatePath("/trade_output");
  revalidatePath("/trade_input");

  return true;
}

export async function tradeAcceptEvent(
  id: number,
  reqId: number,
  resId: number,
) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data, error } = await supabase
    .from("product_trades")
    .update({ state: 1 })
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message || "교환 요청 수락 중 에러가 발생했습니다.");
  }
  const { data: reqData, error: reqError } = await supabase
    .from("products")
    .update({ state: 2 })
    .eq("id", reqId);
  if (reqError) {
    throw new Error(
      reqError.message || "교환 요청 수락 중 에러가 발생했습니다.",
    );
  }
  const { data: resData, error: resError } = await supabase
    .from("products")
    .update({ state: 2 })
    .eq("id", resId);
  if (resError) {
    throw new Error(
      resError.message || "교환 요청 수락 중 에러가 발생했습니다.",
    );
  }
  revalidatePath("/");
  revalidatePath("/my_items");
  revalidatePath("/trade_output");
  revalidatePath("/trade_input");

  return true;
}
