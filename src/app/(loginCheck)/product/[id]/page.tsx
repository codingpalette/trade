import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/type/database.types";
import { cookies } from "next/headers";

export default async function ProdictPage({
  params,
}: {
  params: { id: number };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  // 아이템하나 가져오기
  const { data } = await supabase
    .from("products")
    .select(`*, product_images(*)  `)
    .eq("id", params.id)
    .maybeSingle();

  // const {data } = await supabase.from("products").select("*").eq("id", params.id);

  console.log("params", params);
  console.log("data", data);

  return (
    <div>
      <h1>Product Page</h1>
    </div>
  );
}
