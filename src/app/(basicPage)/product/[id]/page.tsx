import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/type/database.types";
import { cookies } from "next/headers";
import NotItemContent from "@/components/base/NotItemContent";
import ProductContent from "@/app/(basicPage)/_components/ProductContent";

export default async function ProdictPage({
  params,
}: {
  params: { id: number };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  // 아이템하나 가져오기
  const { data } = await supabase
    .from("products")
    .select(`*, product_images(*), profiles(*)  `)
    .eq("id", params.id)
    .maybeSingle();

  // const {data } = await supabase.from("products").select("*").eq("id", params.id);

  // console.log("params", params);
  // console.log("data", data);

  if (!data) {
    return <NotItemContent />;
  } else {
    return <ProductContent data={data} />;
  }
}
