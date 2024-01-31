import { Database } from "@/type/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import MyItemsContent from "@/app/(loginCheck)/_components/MyItemsContent";

export default async function MyItems() {
  const supabase = createServerComponentClient<Database>({ cookies });
  // console.log("supabase", supabase);
  const { data, error } = await supabase.auth.getSession();
  // console.log("data", data);
  if (data.session?.user) {
    let query = supabase
      .from("products")
      .select(`*, product_images(*), profiles(*)`)
      .eq("user_id", data.session.user.id)
      .order("id", { ascending: false })
      .limit(20);

    const { data: itemList } = await query;

    // console.log("itemList", itemList);

    if (itemList) {
      return (
        <>
          <MyItemsContent data={itemList} user_id={data.session.user.id} />
        </>
      );
    }
  }
}
