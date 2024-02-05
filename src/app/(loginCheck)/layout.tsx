import { Database } from "@/type/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  // console.log("supabase", supabase);
  const { data, error } = await supabase.auth.getSession();
  // console.log("data", data);
  if (!data.session) {
    redirect("/");
  }
  // console.log("error", error);
  return <>{children}</>;
}
