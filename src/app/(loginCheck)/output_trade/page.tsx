import { Database } from "@/type/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { eq } from "lodash";
import { cookies } from "next/headers";
import InOutTradeContent from "@/app/(loginCheck)/_components/InOutTradeContent";
export const dynamic = "force-dynamic";

export default async function OutputTradePage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data, error } = await supabase.auth.getSession();
  if (data.session?.user) {
    const { data: itemList } = await supabase
      .from("product_trades")
      .select(
        `*, res_product:res_product_id(*, product_images(*)), req_product:req_product_id(*, product_images(*))
        `,
      )
      .eq("res_user_id", data.session.user.id);

    // console.log("data", itemList);
    return <InOutTradeContent data={itemList} />;
  }
}
