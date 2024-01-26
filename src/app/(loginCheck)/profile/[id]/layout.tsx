import { Database } from "@/type/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const supabase = createServerComponentClient<Database>({ cookies });
  // console.log("supabase", supabase);
  const { data, error } = await supabase.auth.getSession();

  if (data?.session?.user.id !== params.id) {
    redirect("/");
  }

  return <>{children}</>;
}
