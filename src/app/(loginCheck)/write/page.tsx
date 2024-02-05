import { Database } from "@/type/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import WriteContent from "@/app/(loginCheck)/_components/WriteContent";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function WritePage({
  searchParams,
}: {
  searchParams: { [id: string]: string | undefined };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  // console.log("supabase", supabase);
  const { data: userData } = await supabase.auth.getSession();

  let itemData = null;

  if (searchParams.id && userData.session?.user) {
    const { data } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("id", searchParams.id)
      .eq("user_id", userData.session?.user.id)
      .maybeSingle();

    if (!data) {
      redirect("/");
    }
    itemData = data;
  }

  return (
    <>
      <WriteContent data={itemData} />
    </>
  );
}
